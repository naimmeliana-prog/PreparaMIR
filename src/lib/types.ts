import type { MessageMetadata } from "@/lib/tutor";

export type { MessageMetadata };

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  metadata: MessageMetadata | null;
  createdAt: string;
}

export interface ConversationSummary {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  preview: string | null;
}

export interface CategoryStat {
  category: string;
  total: number;
  correct: number;
}

export interface Stats {
  totalAnswered: number;
  totalCorrect: number;
  accuracy: number;
  perCategory: CategoryStat[];
  conversations: number;
}
