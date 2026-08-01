import {
  topics,
  allQuestions,
  categories,
  type QuizQuestion,
  type Topic,
} from "@/lib/knowledge-base";

export interface MessageMetadata {
  type?: "quiz";
  questionId?: string;
  category?: string;
  stem?: string;
  options?: string[];
  correctIndex?: number;
  explanation?: string;
  answered?: number | null;
}

export interface TutorReply {
  content: string;
  metadata?: MessageMetadata | null;
}

export interface QuizBatchMetadata extends MessageMetadata {
  questions?: QuizQuestion[];
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function includesAny(text: string, words: string[]): boolean {
  return words.some((w) => text.includes(normalize(w)));
}

function isGreeting(text: string): boolean {
  return includesAny(text, ["hola", "buenas", "buenos dias", "buenas tardes", "hey", "que tal", "saludos"]);
}

function isHelp(text: string): boolean {
  return includesAny(text, ["ayuda", "que puedes hacer", "qué puedes hacer", "como funciona", "cómo funciona", "opciones", "menu"]);
}

function isQuizRequest(text: string): boolean {
  return includesAny(text, [
    "pregunta",
    "test",
    "quiz",
    "examen",
    "ponme",
    "repaso",
    "comprueba",
    "evaluame",
    "evalúame",
    "preguntame",
    "pregúntame",
  ]);
}

function detectCategory(text: string): string | null {
  for (const c of categories) {
    if (text.includes(normalize(c))) return c;
  }
  // synonyms / partials
  if (text.includes("corazon") || text.includes("cardi")) return "Cardiología";
  if (text.includes("pulmon") || text.includes("neumo") || text.includes("asma") || text.includes("epoc"))
    return "Neumología";
  if (text.includes("digestiv") || text.includes("cirrosis") || text.includes("pancrea")) return "Aparato digestivo";
  if (text.includes("diabet") || text.includes("tiroid") || text.includes("cushing")) return "Endocrinología";
  if (text.includes("renal") || text.includes("nefr")) return "Nefrología";
  if (text.includes("cereb") || text.includes("ictus") || text.includes("neuro")) return "Neurología";
  if (text.includes("sepsis") || text.includes("infecc") || text.includes("meningitis")) return "Infecciosas";
  if (text.includes("lupus") || text.includes("reuma")) return "Reumatología";
  if (text.includes("anemia") || text.includes("sangre") || text.includes("hemat")) return "Hematología";
  return null;
}

function countRequested(text: string): number {
  const m = text.match(/(\d{1,2})\s*(pregunta|test|preguntas|preguntitas|item|items|caso|casos)/);
  if (m) {
    const n = parseInt(m[1], 10);
    if (n >= 1 && n <= 10) return n;
  }
  return 1;
}

<<<<<<< HEAD
export function matchTopic(text: string): Topic | null {
=======
function matchTopic(text: string): Topic | null {
>>>>>>> 1256ef975a9f2d43e80bb7b5543bd3902a7f17c8
  let best: { topic: Topic; score: number } | null = null;
  for (const topic of topics) {
    let score = 0;
    for (const kw of topic.keywords) {
      if (text.includes(normalize(kw))) score += kw.length > 4 ? 2 : 1;
    }
    if (topic.id === "diabetes" && text.includes("diabet")) score += 2;
    if (score > 0 && (!best || score > best.score)) best = { topic, score };
  }
  return best ? best.topic : null;
}

function formatTopicReply(topic: Topic): string {
  const lines: string[] = [];
  lines.push(`### ${topic.title}`);
  lines.push("");
  lines.push(topic.summary);
  lines.push("");
  lines.push("**Puntos clave:**");
  for (const p of topic.keyPoints) lines.push(`• ${p}`);
  lines.push("");
  lines.push("**Alto rendimiento (high-yield):**");
  for (const h of topic.highYield) lines.push(`▸ ${h}`);
  lines.push("");
  lines.push(
    `_${topic.category}_ · ¿Quieres practicar? Escribe *“pregunta de ${topic.category.toLowerCase()}”* para un caso de test.`
  );
  return lines.join("\n");
}

function greetingReply(): string {
  return [
    "¡Hola! 👋 Soy tu **tutor de preparación del MIR**.",
    "",
    "Puedo ayudarte a repasar conceptos y a practicar con preguntas tipo test. Dime, por ejemplo:",
    "",
    "• *“Explícame la fibrilación auricular”* — repaso de un tema",
    "• *“Ponme una pregunta de Neumología”* — un caso de test",
    "• *“Hazme un test de 5 preguntas”* — batería aleatoria",
    "",
    "¿Por dónde empezamos? 🩺",
  ].join("\n");
}

function helpReply(): string {
  return [
    "Esto es lo que puedo hacer por ti:",
    "",
    "📚 **Repasar temas** — pregunta por una patología (p. ej. *“háblame del ictus isquémico”* o *“sepsis”*).",
    "✅ **Preguntas tipo test** — pide *“una pregunta de Cardiología”* o de la especialidad que quieras.",
    "🧪 **Batería de test** — *“hazme un test de 5 preguntas”* (aleatorias o por categoría).",
    "📊 **Seguimiento** — consulta tu panel de progreso para ver aciertos por especialidad.",
    "",
    "Tengo material de alta rentabilidad de **" +
      categories.length +
      " especialidades**. ¡A por todas!",
  ].join("\n");
}

function defaultReply(text: string): string {
  const topic = matchTopic(text);
  if (topic) return formatTopicReply(topic);

  // Suggest close topics by keyword
  const words = normalize(text).split(/\s+/).filter((w) => w.length > 4);
  const candidates = topics.filter((t) =>
    words.some((w) => normalize(t.title + t.keywords.join(" ")).includes(w))
  );
  const suggestion = candidates.slice(0, 4).map((t) => `• ${t.title}`);
  const intro =
    "No tengo un tema exacto para eso, pero puedo explicarte conceptos de alta rentabilidad del MIR. Algunas ideas:";
  const topicsList = suggestion.length
    ? suggestion.join("\n")
    : "• Cardiología (IAM, IC, fibrilación auricular, HTA)\n• Neumología (EPOC, asma, TEP, neumonía)\n• Aparato digestivo (cirrosis, pancreatitis, EII)\n• Neurología (ictus)\n• Infecciosas (sepsis, endocarditis, meningitis)";
  return [
    intro,
    "",
    topicsList,
    "",
    'Escribe el nombre de un tema o pide *"una pregunta"* para practicar.',
  ].join("\n");
}

function buildQuizMessage(question: QuizQuestion, intro?: string): TutorReply {
  const content =
    (intro ? intro + "\n\n" : "") +
    `**Caso (${question.category})**\n\n${question.stem}`;
  return {
    content,
    metadata: {
      type: "quiz",
      questionId: question.id,
      category: question.category,
      stem: question.stem,
      options: question.options,
      correctIndex: question.correctIndex,
      explanation: question.explanation,
      answered: null,
    },
  };
}

/** Generate a quiz response, optionally filtered by category. */
export function generateQuiz(category: string | null, count = 1, intro?: string): TutorReply[] {
  const pool = category
    ? allQuestions.filter((q) => q.category === category)
    : allQuestions;
  if (pool.length === 0) {
    return [
      {
        content: `No tengo preguntas de la categoría *“${category}”* en este momento. Prueba con: ${categories
          .slice(0, 5)
          .join(", ")}…`,
      },
    ];
  }
  // shuffle and take up to count
  const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(count, pool.length));
  const intros =
    count > 1
      ? [
          `¡Vamos con ${count} preguntas! Responde cada una y te explico la respuesta. 🧠`,
          `Test de ${count} preguntas. ¡Lee con calma y elige la opción correcta! ✍️`,
        ]
      : [
          "Aquí tienes una pregunta. Elige una opción y te doy la justificación. 💡",
          "Vamos a practicar. Responde y comprobamos juntos. 🎯",
        ];
  const lead = intro ?? pick(intros);
  return shuffled.map((q, i) => buildQuizMessage(q, i === 0 ? lead : undefined));
}

/** Produce feedback after the user answers a quiz question. */
export function gradeQuiz(params: {
  correctIndex: number;
  selectedIndex: number;
  options: string[];
  stem: string;
  explanation: string;
  category: string;
}): { userContent: string; assistantContent: string; isCorrect: boolean } {
  const isCorrect = params.selectedIndex === params.correctIndex;
  const chosen = params.options[params.selectedIndex];
  const correct = params.options[params.correctIndex];
  const userContent = `${String.fromCharCode(65 + params.selectedIndex)} → ${chosen}`;
  const emoji = isCorrect ? "✅ ¡Correcto!" : "❌ Incorrecto.";
  const assistantContent = [
    `### ${emoji}`,
    "",
    `**Pregunta:** ${params.stem}`,
    "",
    isCorrect
      ? `Tu respuesta **(${String.fromCharCode(65 + params.selectedIndex)}) ${chosen}** es la correcta.`
      : `Elegiste **(${String.fromCharCode(65 + params.selectedIndex)}) ${chosen}**, pero la respuesta correcta es **(${String.fromCharCode(65 + params.correctIndex)}) ${correct}**.`,
    "",
    `**Justificación:** ${params.explanation}`,
    "",
    `_${params.category}_ · Escribe *“otra pregunta”* para seguir practicando.`,
  ].join("\n");
  return { userContent, assistantContent: assistantContent, isCorrect };
}

/** Title for a conversation derived from the first user message. */
export function deriveTitle(input: string): string {
  const clean = input.replace(/\s+/g, " ").trim();
  if (clean.length <= 42) return clean.charAt(0).toUpperCase() + clean.slice(1);
  return clean.slice(0, 42).trim() + "…";
}

/**
 * Core: given the user's latest text message (not a quiz answer), produce one
 * or more assistant replies. Replies are returned in order; the first may carry
 * quiz metadata when the user requested a question/test.
 */
export function respondToText(input: string): TutorReply[] {
  const text = normalize(input);

  if (isGreeting(text)) return [{ content: greetingReply() }];
  if (isHelp(text)) return [{ content: helpReply() }];

  if (isQuizRequest(text)) {
    const category = detectCategory(text);
    const count = countRequested(text);
    if (count > 1 || /varias|aleatorias|bateria|batería|serie/i.test(input)) {
      return generateQuiz(category, Math.max(countRequested(input), 1));
    }
    return generateQuiz(category, 1);
  }

  // topic explanation
  const topic = matchTopic(text);
  if (topic) return [{ content: formatTopicReply(topic) }];

  return [{ content: defaultReply(input) }];
}
