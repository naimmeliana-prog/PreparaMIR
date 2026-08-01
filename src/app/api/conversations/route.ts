import { db } from "@/db";
import { conversations, messages } from "@/db/schema";
<<<<<<< HEAD
import { asc, desc, inArray } from "@/db/mock_helpers";
=======
import { asc, desc, inArray } from "drizzle-orm";
>>>>>>> 1256ef975a9f2d43e80bb7b5543bd3902a7f17c8
import type { ConversationSummary } from "@/lib/types";

export const dynamic = "force-dynamic";

function cleanPreview(text: string): string {
  return text
    .replace(/[*_`#>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 90);
}

export async function GET() {
  const convs = await db
    .select()
    .from(conversations)
    .orderBy(desc(conversations.updatedAt));

  if (convs.length === 0) {
    return Response.json({ conversations: [] });
  }

  const convIds = convs.map((c) => c.id);
  const allMsgs = await db
    .select()
    .from(messages)
    .where(inArray(messages.conversationId, convIds))
    .orderBy(asc(messages.createdAt));

  // last message per conversation becomes the preview
  const previewByConv = new Map<string, string | null>();
  for (const m of allMsgs) {
    previewByConv.set(m.conversationId, cleanPreview(m.content));
  }

  const result: ConversationSummary[] = convs.map((c) => ({
    id: c.id,
    title: c.title,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    preview: previewByConv.get(c.id) ?? null,
  }));

  return Response.json({ conversations: result });
}
