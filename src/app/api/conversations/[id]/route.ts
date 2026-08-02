import { NextResponse } from "next/server";
import { db } from "@/db";
import { conversations, messages } from "@/db/schema";
import { eq, asc } from "@/db/mock_helpers";
import type { ChatMessage, MessageMetadata } from "@/lib/types";
import type { MessageMetadata as TutorMeta } from "@/lib/tutor";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const [conv] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, id));
  if (!conv) {
    return NextResponse.json(
      { error: "Conversation not found" },
      { status: 404 }
    );
  }

  const rows = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, id))
    .orderBy(asc(messages.createdAt));

  const msgs: ChatMessage[] = rows.map((r) => ({
    id: r.id,
    conversationId: r.conversationId,
    role: r.role as "user" | "assistant",
    content: r.content,
    metadata: (r.metadata ?? null) as MessageMetadata | TutorMeta | null,
    createdAt: r.createdAt.toISOString(),
  }));

  return Response.json({
    conversation: {
      id: conv.id,
      title: conv.title,
      createdAt: conv.createdAt.toISOString(),
      updatedAt: conv.updatedAt.toISOString(),
    },
    messages: msgs,
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.delete(conversations).where(eq(conversations.id, id));
  return Response.json({ ok: true });
}
