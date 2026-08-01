// Mock para emular Drizzle Schema / Drizzle helpers
// de forma que no tengamos dependencias de Drizzle-kit o Postgres en la lógica de consultas
export const conversations = { name: "conversations", id: { name: "id" } };
export const messages = { name: "messages", id: { name: "id" }, conversationId: { name: "conversationId" } };

// Mock de comparadores Drizzle-ORM
export function eq(fieldObj: any, value: any) {
  return { field: fieldObj.name || "id", value, operator: "eq" };
}

export function inArray(fieldObj: any, values: any[]) {
  return { field: fieldObj.name || "conversationId", value: values, operator: "inArray" };
}

export function desc(fieldObj: any) {
  return { field: fieldObj.name || "updatedAt", direction: "desc" };
}

export function asc(fieldObj: any) {
  return { field: fieldObj.name || "createdAt", direction: "asc" };
}

export function count() {
  return { type: "count" };
}

export const sql = (strings: TemplateStringsArray, ...values: any[]) => {
  return { strings, values };
};
