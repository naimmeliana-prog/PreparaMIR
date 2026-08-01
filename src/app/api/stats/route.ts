import { db } from "@/db";
import { conversations, messages } from "@/db/schema";
<<<<<<< HEAD
import { count, sql } from "@/db/mock_helpers";
=======
import { count, sql } from "drizzle-orm";
>>>>>>> 1256ef975a9f2d43e80bb7b5543bd3902a7f17c8
import type { Stats, CategoryStat } from "@/lib/types";

export const dynamic = "force-dynamic";

interface QuizMetaRow {
  metadata: unknown;
}

export async function GET() {
  const [convCount] = await db
    .select({ value: count() })
    .from(conversations);

  const result = await db.execute(sql`
    SELECT metadata
    FROM messages
    WHERE role = ${"assistant"}
      AND metadata->>'type' = ${"quiz"}
      AND metadata->>'answered' IS NOT NULL
  `);

  const rows = ((result.rows ?? []) as unknown as { metadata: unknown }[]).map(
    (r) => ({ metadata: r.metadata })
  );

  const perCat = new Map<string, CategoryStat>();
  let totalAnswered = 0;
  let totalCorrect = 0;

  for (const row of rows) {
    const meta = row.metadata as {
      category?: string;
      correctIndex?: number;
      answered?: number;
    } | null;
    if (!meta || meta.correctIndex == null || meta.answered == null) continue;
    const category = meta.category ?? "General";
    const isCorrect = meta.answered === meta.correctIndex;
    totalAnswered += 1;
    if (isCorrect) totalCorrect += 1;
    const prev = perCat.get(category) ?? {
      category,
      total: 0,
      correct: 0,
    };
    prev.total += 1;
    if (isCorrect) prev.correct += 1;
    perCat.set(category, prev);
  }

  const perCategory = Array.from(perCat.values()).sort(
    (a, b) => b.total - a.total
  );

  const stats: Stats = {
    totalAnswered,
    totalCorrect,
    accuracy: totalAnswered === 0 ? 0 : Math.round((totalCorrect / totalAnswered) * 100),
    perCategory,
    conversations: Number(convCount?.value ?? 0),
  };

  return Response.json(stats);
}
