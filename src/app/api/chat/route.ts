import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { messages, conversations } from "@/db/schema";
import { eq, count } from "@/db/mock_helpers";
import { topics, Topic } from "@/lib/knowledge-base";
import type { MessageMetadata } from "@/lib/tutor";

interface MessageRow {
  id: string;
  conversationId: string;
  role: string;
  content: string;
  metadata: MessageMetadata | null;
  createdAt: Date;
}

import { matchTopic } from "@/lib/tutor";

function serialize(row: MessageRow) {
  return {
    ...row,
    createdAt: row.createdAt.toISOString(),
  };
}

// Fallback local offline de respuestas en caso de fallo total de APIs
function respondToText(text: string): { content: string; metadata?: MessageMetadata | null }[] {
  const matched = matchTopic(text);
  if (!matched) {
    return [
      {
        content: `Hola. Soy tu tutor de preparación del MIR. Como estamos en modo offline, mis respuestas están limitadas a temas clave.

¿De qué especialidad o tema te gustaría hablar? Puedo darte resúmenes rápidos de Cardiología (IAMCEST), Endocrinología (Diabetes) o Nefrología (Injuria Renal).`,
      },
    ];
  }

  let content = `### ${matched.title}\n*Especialidad: ${matched.category}*\n\n${matched.summary}\n\n`;
  content += `**Puntos clave:**\n` + matched.keyPoints.map((p) => `- ${p}`).join("\n") + "\n\n";
  content += `**Alta rentabilidad (high-yield):**\n` + matched.highYield.map((h) => `- ${h}`).join("\n");

  const question = matched.practiceQuestion;
  if (!question) {
    return [
      { content },
    ];
  }
  const metadata: MessageMetadata = {
    type: "quiz",
    stem: question.stem,
    options: question.options,
    correctIndex: question.correctIndex,
    explanation: question.explanation,
    answered: null,
  };

  return [
    { content },
    {
      content: `Aquí tienes una pregunta de autoevaluación oficial sobre **${matched.title}** para practicar:`,
      metadata,
    },
  ];
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { answer } = body;

  // Lógica para responder a un test interactivo en el chat
  if (answer) {
    const { messageId, selectedIndex } = answer;
    const [msgRow] = await db
      .select()
      .from(messages)
      .where(eq(messages.id, messageId));
    if (!msgRow) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    const meta = msgRow.metadata as MessageMetadata | null;
    if (!meta || meta.type !== "quiz") {
      return NextResponse.json({ error: "Invalid quiz" }, { status: 400 });
    }

    meta.answered = selectedIndex;
    await db
      .update(messages)
      .set({ metadata: meta })
      .where(eq(messages.id, messageId));

    const isCorrect = selectedIndex === meta.correctIndex;
    const userMsgContent = `He respondido la opción: ${meta.options[selectedIndex]}`;
    const assistantReply = isCorrect
      ? `🎉 **¡Correcto!** Has seleccionado la respuesta adecuada.\n\n${meta.explanation}`
      : `❌ **Incorrecto.** La respuesta correcta era la Opción ${String.fromCharCode(65 + meta.correctIndex)}: *${meta.options[meta.correctIndex]}*.\n\n${meta.explanation}`;

    const [userMessage] = await db
      .insert(messages)
      .values({
        conversationId: msgRow.conversationId,
        role: "user",
        content: userMsgContent,
      })
      .returning();

    const [assistantMessage] = await db
      .insert(messages)
      .values({
        conversationId: msgRow.conversationId,
        role: "assistant",
        content: assistantReply,
      })
      .returning();

    return NextResponse.json({
      answeredIndex: selectedIndex,
      userMessage: serialize(userMessage as unknown as MessageRow),
      assistantMessage: serialize(assistantMessage as unknown as MessageRow),
    });
  }

  // Lógica de chat estándar
  const { conversationId: bodyId, content } = body;
  let conversationId = bodyId;
  let created = false;

  if (!conversationId) {
    const [convRow] = await db
      .insert(conversations)
      .values({ title: content.slice(0, 40) + (content.length > 40 ? "..." : "") })
      .returning();
    conversationId = convRow.id;
    created = true;
  } else {
    const [existing] = await db
      .select({ id: conversations.id })
      .from(conversations)
      .where(eq(conversations.id, conversationId));
    if (!existing) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }
  }

  const [userMsg] = await db
    .insert(messages)
    .values({ conversationId, role: "user", content })
    .returning();

  let replies: { content: string; metadata?: MessageMetadata | null }[] = [];
  let apiSuccess = false;

  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  const nvidiaKey = process.env.NVIDIA_API_KEY;
  const cohereKey = process.env.COHERE_API_KEY;

  // Obtener historial común para las APIs
  let historyRows: any[] = [];
  try {
    historyRows = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);
  } catch {}

  const matchedTopic = matchTopic(content);
  let systemPrompt = `Eres un tutor de preparación del examen MIR (Médico Interno Residente) en España.
Tu objetivo es ayudar al usuario a repasar conceptos médicos y responder a sus dudas de forma clara, didáctica y estructurada, con enfoque en temas de alta rentabilidad (high-yield) para el examen.
Usa terminología médica adecuada para España y adopta un tono profesional, motivador y directo.

INSTRUCCIONES CRÍTICAS:
- Responde DIRECTAMENTE a la consulta o duda médica del usuario.
- NO saludes, no te presentes, ni des la bienvenida en cada mensaje si el usuario ya está discutiendo un caso o haciendo una pregunta específica.
- Si el usuario te hace una pregunta sobre una patología, aborda el tema de inmediato de forma estructurada sin rodeos ni mensajes introductorios de bienvenida.`;

  if (matchedTopic) {
    systemPrompt += `\n\nContexto de estudio relevante para la consulta del usuario:\nTema: ${matchedTopic.title}\nCategoría: ${matchedTopic.category}\nResumen: ${matchedTopic.summary}\nPuntos clave:\n${matchedTopic.keyPoints.map((p) => `- ${p}`).join("\n")}\nAlta rentabilidad:\n${matchedTopic.highYield.map((h) => `- ${h}`).join("\n")}`;
  }

  // 1. Prioridad: Groq API (Totalmente gratuito, 14,400 llamadas/día, sin geobloqueo en España)
  if (!apiSuccess && groqKey) {
    try {
      const groqMessages = [
        { role: "system", content: systemPrompt },
        ...historyRows.slice(-15).map((row) => ({
          role: row.role === "user" ? "user" : "assistant",
          content: row.content,
        })),
      ];

      console.log("[TUTOR IA] Enviando a Groq:", JSON.stringify({ model: "llama-3.1-8b-instant", messages: groqMessages }, null, 2));

      const apiResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: groqMessages,
          temperature: 0.7,
          max_tokens: 1200,
        }),
      });

      if (apiResponse.ok) {
        const responseData = await apiResponse.json();
        const assistantText = responseData?.choices?.[0]?.message?.content;
        console.log("[TUTOR IA] Respuesta Groq 8B:", assistantText);
        if (assistantText) {
          replies = [{ content: assistantText }];
          apiSuccess = true;
        }
      } else {
        const errText = await apiResponse.text();
        console.log("[TUTOR IA] Error Groq 8B:", apiResponse.status, errText);
        
        // Fallback rápido a Llama 70B si el de 8B tiene saturación
        const backupResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${groqKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: groqMessages,
            temperature: 0.7,
            max_tokens: 1200,
          }),
        });
        if (backupResponse.ok) {
          const responseData = await backupResponse.json();
          const assistantText = responseData?.choices?.[0]?.message?.content;
          console.log("[TUTOR IA] Respuesta Groq 70B:", assistantText);
          if (assistantText) {
            replies = [{ content: assistantText }];
            apiSuccess = true;
          }
        } else {
          const backupErrText = await backupResponse.text();
          console.log("[TUTOR IA] Error Groq 70B:", backupResponse.status, backupErrText);
        }
      }
    } catch (err) {
      console.error("Failed to connect to Groq API:", err);
    }
  }

  // 2. Prioridad: NVIDIA API (meta/llama-3.1-8b-instruct)
  if (!apiSuccess && nvidiaKey) {
    try {
      const nvidiaMessages = [
        { role: "system", content: systemPrompt },
        ...historyRows.slice(-15).map((row) => ({
          role: row.role === "user" ? "user" : "assistant",
          content: row.content,
        })),
      ];

      console.log("[TUTOR IA] Enviando a NVIDIA:", JSON.stringify({ model: "meta/llama-3.1-8b-instruct", messages: nvidiaMessages }, null, 2));

      const apiResponse = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${nvidiaKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta/llama-3.1-8b-instruct",
          messages: nvidiaMessages,
          temperature: 0.7,
          max_tokens: 1200,
        }),
      });

      if (apiResponse.ok) {
        const responseData = await apiResponse.json();
        const assistantText = responseData?.choices?.[0]?.message?.content;
        console.log("[TUTOR IA] Respuesta NVIDIA:", assistantText);
        if (assistantText) {
          replies = [{ content: assistantText }];
          apiSuccess = true;
        }
      } else {
        const errText = await apiResponse.text();
        console.log("[TUTOR IA] Error NVIDIA:", apiResponse.status, errText);
      }
    } catch (err) {
      console.error("Failed to connect to NVIDIA API:", err);
    }
  }

  // 3. Prioridad: Cohere API (command-r-plus)
  if (!apiSuccess && cohereKey) {
    try {
      const cohereMessages = [
        { role: "system", content: systemPrompt },
        ...historyRows.slice(-15).map((row) => ({
          role: row.role === "user" ? "user" : "assistant",
          content: row.content,
        })),
      ];

      console.log("[TUTOR IA] Enviando a Cohere:", JSON.stringify({ model: "command-r-plus", messages: cohereMessages }, null, 2));

      const apiResponse = await fetch("https://api.cohere.com/v2/chat", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${cohereKey}`,
          "Content-Type": "application/json",
          "accept": "application/json",
        },
        body: JSON.stringify({
          model: "command-r-plus",
          messages: cohereMessages,
        }),
      });

      if (apiResponse.ok) {
        const responseData = await apiResponse.json();
        const assistantText = responseData?.message?.content?.[0]?.text;
        console.log("[TUTOR IA] Respuesta Cohere:", assistantText);
        if (assistantText) {
          replies = [{ content: assistantText }];
          apiSuccess = true;
        }
      } else {
        const errText = await apiResponse.text();
        console.log("[TUTOR IA] Error Cohere:", apiResponse.status, errText);
      }
    } catch (err) {
      console.error("Failed to connect to Cohere API:", err);
    }
  }

  // 4. Prioridad: Google Gemini API Directo
  if (!apiSuccess && geminiKey) {
    try {
      const geminiContents = [];
      const historyList = historyRows.slice(-15);
      
      for (let i = 0; i < historyList.length; i++) {
        const row = historyList[i];
        let textContent = row.content;
        if (i === 0 && row.role === "user") {
          textContent = `${systemPrompt}\n\n[Consulta del usuario]: ${row.content}`;
        }
        geminiContents.push({
          role: row.role === "user" ? "user" : "model",
          parts: [{ text: textContent }]
        });
      }

      if (geminiContents.length === 0 || geminiContents[0].role !== "user") {
        geminiContents.unshift({
          role: "user",
          parts: [{ text: `${systemPrompt}\n\n[Consulta del usuario]: Hola` }]
        });
      }

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`;
      console.log("[TUTOR IA] Enviando a Gemini:", JSON.stringify({ contents: geminiContents }, null, 2));

      const apiResponse = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: geminiContents,
        }),
      });

      if (apiResponse.ok) {
        const responseData = await apiResponse.json();
        const assistantText = responseData?.candidates?.[0]?.content?.parts?.[0]?.text;
        console.log("[TUTOR IA] Respuesta Gemini:", assistantText);
        if (assistantText) {
          replies = [{ content: assistantText }];
          apiSuccess = true;
        }
      } else {
        const errText = await apiResponse.text();
        console.error("[TUTOR IA] Error Gemini:", apiResponse.status, errText);
      }
    } catch (err) {
      console.error("Failed to connect to Gemini API:", err);
    }
  }

  // 5. Prioridad: OpenRouter (Capa gratuita)
  if (!apiSuccess && openrouterKey) {
    try {
      const openRouterMessages = [
        { role: "system", content: systemPrompt },
        ...historyRows.slice(-15).map((row) => ({
          role: row.role === "user" ? "user" : "assistant",
          content: row.content,
        })),
      ];

      console.log("[TUTOR IA] Enviando a OpenRouter:", JSON.stringify({ model: "openrouter/free", messages: openRouterMessages }, null, 2));

      const apiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openrouterKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://github.com/naimmeliana-prog/PreparaMIR",
          "X-Title": "PreparaMIR Tutor",
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: openRouterMessages,
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (apiResponse.ok) {
        const responseData = await apiResponse.json();
        const assistantText = responseData?.choices?.[0]?.message?.content;
        console.log("[TUTOR IA] Respuesta OpenRouter:", assistantText);
        if (assistantText) {
          replies = [{ content: assistantText }];
          apiSuccess = true;
        }
      } else {
        const errText = await apiResponse.text();
        console.log("[TUTOR IA] Error OpenRouter:", apiResponse.status, errText);
      }
    } catch (err) {
      console.error("Failed to connect to OpenRouter:", err);
    }
  }

  // 4. Último Fallback: Offline local matching
  if (!apiSuccess) {
    replies = respondToText(content);
  }

  const assistantRows: MessageRow[] = [];
  for (const reply of replies) {
    const [row] = await db
      .insert(messages)
      .values({
        conversationId,
        role: "assistant",
        content: reply.content,
        metadata: (reply.metadata ?? null) as MessageMetadata | null,
      })
      .returning();
    assistantRows.push(row as unknown as MessageRow);
  }

  await db
    .update(conversations)
    .set({ updatedAt: new Date() })
    .where(eq(conversations.id, conversationId));

  return NextResponse.json({
    conversationId,
    created,
    userMessage: serialize(userMsg as unknown as MessageRow),
    assistantMessages: assistantRows.map(serialize),
  });
}
