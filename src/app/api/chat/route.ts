import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { conversations, messages } from "@/db/schema";
<<<<<<< HEAD
import { eq, inArray } from "@/db/mock_helpers";
import { respondToText, gradeQuiz, deriveTitle, matchTopic } from "@/lib/tutor";
=======
import { eq } from "drizzle-orm";
import { respondToText, gradeQuiz, deriveTitle } from "@/lib/tutor";
>>>>>>> 1256ef975a9f2d43e80bb7b5543bd3902a7f17c8
import type { MessageMetadata } from "@/lib/tutor";
import type { ChatMessage } from "@/lib/types";

export const dynamic = "force-dynamic";

type MessageRow = {
  id: string;
  conversationId: string;
  role: string;
  content: string;
  metadata: unknown;
  createdAt: Date;
};

function serialize(row: MessageRow): ChatMessage {
  return {
    id: row.id,
    conversationId: row.conversationId,
    role: row.role as "user" | "assistant",
    content: row.content,
    metadata: (row.metadata ?? null) as MessageMetadata | null,
    createdAt: row.createdAt.toISOString(),
  };
}

interface ChatBody {
  conversationId?: string;
  content?: string;
  answer?: { messageId: string; selectedIndex: number };
}

export async function POST(req: NextRequest) {
  let body: ChatBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const content = (body.content ?? "").toString().trim();

  // ---------------- Quiz answer path ----------------
  if (body.answer) {
    const { messageId, selectedIndex } = body.answer;
    if (
      typeof selectedIndex !== "number" ||
      selectedIndex < 0 ||
      selectedIndex > 3
    ) {
      return NextResponse.json({ error: "Invalid option" }, { status: 400 });
    }

    const [quizRow] = await db
      .select()
      .from(messages)
      .where(eq(messages.id, messageId));

    if (!quizRow || quizRow.role !== "assistant") {
      return NextResponse.json(
        { error: "Quiz message not found" },
        { status: 404 }
      );
    }

    const meta = (quizRow.metadata ?? {}) as MessageMetadata;
    if (!meta.options || meta.correctIndex == null) {
      return NextResponse.json({ error: "Invalid quiz" }, { status: 400 });
    }
    if (meta.answered !== null && meta.answered !== undefined) {
      return NextResponse.json(
        { error: "Question already answered" },
        { status: 409 }
      );
    }

    const grade = gradeQuiz({
      correctIndex: meta.correctIndex,
      selectedIndex,
      options: meta.options,
      stem: meta.stem ?? "",
      explanation: meta.explanation ?? "",
      category: meta.category ?? "",
    });

    const conversationId = quizRow.conversationId;

    // mark the quiz message as answered
    await db
      .update(messages)
      .set({ metadata: { ...meta, answered: selectedIndex } as MessageMetadata })
      .where(eq(messages.id, messageId));

    const [userMsg] = await db
      .insert(messages)
      .values({ conversationId, role: "user", content: grade.userContent })
      .returning();
    const [assistantMsg] = await db
      .insert(messages)
      .values({
        conversationId,
        role: "assistant",
        content: grade.assistantContent,
      })
      .returning();

    await db
      .update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, conversationId));

    return NextResponse.json({
      conversationId,
      answeredMessageId: messageId,
      answeredIndex: selectedIndex,
      userMessage: serialize(userMsg as unknown as MessageRow),
      assistantMessage: serialize(assistantMsg as unknown as MessageRow),
    });
  }

  // ---------------- Text message path ----------------
  if (!content) {
    return NextResponse.json({ error: "Empty message" }, { status: 400 });
  }

  let conversationId = body.conversationId;
  let created = false;
  if (!conversationId) {
    const [conv] = await db
      .insert(conversations)
      .values({ title: deriveTitle(content) })
      .returning();
    conversationId = conv.id;
    created = true;
  } else {
    // validate existence
    const [existing] = await db
      .select({ id: conversations.id })
      .from(conversations)
      .where(eq(conversations.id, conversationId));
    if (!existing) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }
  }

  const [userMsg] = await db
    .insert(messages)
    .values({ conversationId, role: "user", content })
    .returning();

<<<<<<< HEAD
  let replies: { content: string; metadata?: MessageMetadata | null }[] = [];
  let apiSuccess = false;

  const geminiKey = process.env.GEMINI_API_KEY;
  const openrouterKey = process.env.OPENROUTER_API_KEY;

  // 1. Prioridad: Google Gemini API Directo
  if (geminiKey) {
    try {
      const historyRows = await db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, conversationId))
        .orderBy(messages.createdAt);

      const matchedTopic = matchTopic(content);
      let systemPrompt = `Eres un tutor de preparación del examen MIR (Médico Interno Residente) en España.
Tu objetivo es ayudar al usuario a repasar conceptos médicos y responder a sus dudas de forma clara, didáctica y estructurada, con enfoque en temas de alta rentabilidad (high-yield) para el examen.
Usa terminología médica adecuada para España y adopta un tono profesional, motivador y directo.`;

      if (matchedTopic) {
        systemPrompt += `\n\nContexto de estudio relevante para la consulta del usuario:\nTema: ${matchedTopic.title}\nCategoría: ${matchedTopic.category}\nResumen: ${matchedTopic.summary}\nPuntos clave:\n${matchedTopic.keyPoints.map((p) => `- ${p}`).join("\n")}\nAlta rentabilidad:\n${matchedTopic.highYield.map((h) => `- ${h}`).join("\n")}`;
      }

      // Convertir el historial al formato de Gemini (system prompt concatenado en el primer mensaje de usuario)
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

      // Si el primer mensaje del historial no es de usuario, añadimos el system prompt al inicio
      if (geminiContents.length === 0 || geminiContents[0].role !== "user") {
        geminiContents.unshift({
          role: "user",
          parts: [{ text: `${systemPrompt}\n\n[Consulta del usuario]: Hola` }]
        });
      }

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`;
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
        if (assistantText) {
          replies = [{ content: assistantText }];
          apiSuccess = true;
        }
      } else {
        const errText = await apiResponse.text();
        console.error("Gemini API returned error status:", apiResponse.status, errText);
      }
    } catch (err) {
      console.error("Failed to connect to Gemini API:", err);
    }
  }

  // 2. Fallback: OpenRouter
  if (!apiSuccess && openrouterKey) {
    try {
      // Get conversation history including the user message we just inserted
      const historyRows = await db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, conversationId))
        .orderBy(messages.createdAt);

      // Build context from matched topics
      const matchedTopic = matchTopic(content);
      let systemPrompt = `Eres un tutor de preparación del examen MIR (Médico Interno Residente) en España.
Tu objetivo es ayudar al usuario a repasar conceptos médicos y responder a sus dudas de forma clara, didáctica y estructurada, con enfoque en temas de alta rentabilidad (high-yield) para el examen.
Usa terminología médica adecuada para España y adopta un tono profesional, motivador y directo.`;

      if (matchedTopic) {
        systemPrompt += `\n\nContexto de estudio relevante para la consulta del usuario:\nTema: ${matchedTopic.title}\nCategoría: ${matchedTopic.category}\nResumen: ${matchedTopic.summary}\nPuntos clave:\n${matchedTopic.keyPoints.map((p) => `- ${p}`).join("\n")}\nAlta rentabilidad:\n${matchedTopic.highYield.map((h) => `- ${h}`).join("\n")}`;
      }

      const openRouterMessages = [
        { role: "system", content: systemPrompt },
        ...historyRows.slice(-15).map((row) => ({
          role: row.role === "user" ? "user" : "assistant",
          content: row.content,
        })),
      ];

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
        if (assistantText) {
          replies = [{ content: assistantText }];
          apiSuccess = true;
        }
      } else {
        console.error("OpenRouter API returned error status:", apiResponse.status);
      }
    } catch (err) {
      console.error("Failed to connect to OpenRouter:", err);
    }
  }

  // Fallback to offline tutor if both APIs fail or are not configured
  if (!apiSuccess) {
    replies = respondToText(content);
  }

=======
  const replies = respondToText(content);
>>>>>>> 1256ef975a9f2d43e80bb7b5543bd3902a7f17c8
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
