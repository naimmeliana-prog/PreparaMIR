<<<<<<< HEAD
import fs from "fs";
import path from "path";
import { cookies } from "next/headers";

// Archivo local de almacenamiento
const DB_FILE = path.join(process.cwd(), "public", "local_db.json");

interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

interface Message {
  id: string;
  conversationId: string;
  role: string;
  content: string;
  metadata: any;
  createdAt: string;
  userId?: string;
}

// Obtener el ID de usuario activo de las cookies de sesión
async function getUserId(): Promise<string | undefined> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("userId")?.value;
  } catch {
    // Si se llama fuera de un contexto de request (ej: scripts locales)
    return undefined;
  }
}

// Carga inicial/creación del archivo
function loadData(): { conversations: Conversation[]; messages: Message[]; users?: any[] } {
  if (!fs.existsSync(DB_FILE)) {
    const initial = { conversations: [], messages: [], users: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    return {
      conversations: parsed.conversations || [],
      messages: parsed.messages || [],
      users: parsed.users || []
    };
  } catch {
    return { conversations: [], messages: [], users: [] };
  }
}

function saveData(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Mock de Drizzle ORM con filtrado automático por usuario
class MockQueryBuilder {
  private table: string;
  private whereClause: any = null;
  private orderClause: any = null;
  private selectFields: any = null;

  constructor(table: string, selectFields: any = null) {
    this.table = table;
    this.selectFields = selectFields;
  }

  where(clause: any) {
    this.whereClause = clause;
    return this;
  }

  orderBy(clause: any) {
    this.orderClause = clause;
    return this;
  }

  async then(onfulfilled?: (value: any) => any) {
    const data = loadData();
    const activeUserId = await getUserId();

    let rows = this.table === "conversations" ? [...data.conversations] : [...data.messages];

    // FILTRADO DE SEGURIDAD CRÍTICO: Cada usuario solo ve sus propios datos
    if (activeUserId) {
      rows = rows.filter((r: any) => r.userId === activeUserId);
    } else {
      // Si no hay sesión, devolvemos vacío para proteger privacidad
      rows = [];
    }

    // Aplicar filtros básicos de búsqueda
    if (this.whereClause) {
      const { field, value, operator } = this.whereClause;
      if (operator === "eq") {
        rows = rows.filter((r: any) => r[field] === value);
      } else if (operator === "inArray") {
        const valSet = new Set(value);
        rows = rows.filter((r: any) => valSet.has(r[field]));
      }
    }

    // Mapear a tipos de fecha correctos para que Next.js/Drizzle los serialice
    let resultRows = rows.map((r: any) => ({
      ...r,
      createdAt: new Date(r.createdAt),
      updatedAt: r.updatedAt ? new Date(r.updatedAt) : undefined,
    }));

    // Ordenar
    if (this.orderClause) {
      const { field, direction } = this.orderClause;
      resultRows.sort((a: any, b: any) => {
        const valA = a[field] instanceof Date ? a[field].getTime() : 0;
        const valB = b[field] instanceof Date ? b[field].getTime() : 0;
        return direction === "desc" ? valB - valA : valA - valB;
      });
    }

    // Si se seleccionaron campos específicos (como el count)
    if (this.selectFields && this.selectFields.value) {
      return onfulfilled ? onfulfilled([{ value: resultRows.length }]) : [{ value: resultRows.length }];
    }

    return onfulfilled ? onfulfilled(resultRows) : resultRows;
  }
}

export const db = {
  select(fields?: any) {
    return {
      from(tableObj: any) {
        return new MockQueryBuilder(tableObj.name, fields);
      },
    };
  },

  insert(tableObj: any) {
    return {
      values(payload: any) {
        return {
          returning() {
            return {
              async then(onfulfilled?: (value: any) => any) {
                const data = loadData();
                const activeUserId = await getUserId();
                
                const newRow: any = {
                  id: generateUUID(),
                  createdAt: new Date().toISOString(),
                  userId: activeUserId, // Asignar automáticamente al usuario actual
                  ...payload,
                };
                
                if (tableObj.name === "conversations") {
                  newRow.updatedAt = new Date().toISOString();
                  data.conversations.push(newRow);
                } else {
                  data.messages.push(newRow);
                }
                
                saveData(data);
                
                // Retornar en el mismo formato de Drizzle
                const returnRow = {
                  ...newRow,
                  createdAt: new Date(newRow.createdAt),
                  updatedAt: newRow.updatedAt ? new Date(newRow.updatedAt) : undefined,
                };
                return onfulfilled ? onfulfilled([returnRow]) : [returnRow];
              }
            };
          }
        };
      }
    };
  },

  update(tableObj: any) {
    return {
      set(payload: any) {
        return {
          where(clause: any) {
            return {
              async then(onfulfilled?: (value: any) => any) {
                const data = loadData();
                const activeUserId = await getUserId();
                
                const rows = tableObj.name === "conversations" ? data.conversations : data.messages;
                const { field, value } = clause;
                
                for (const r of rows as any[]) {
                  // Solo actualiza si pertenece al usuario activo
                  if (r[field] === value && r.userId === activeUserId) {
                    Object.assign(r, payload);
                    if (tableObj.name === "conversations") {
                      r.updatedAt = new Date().toISOString();
                    }
                  }
                }
                saveData(data);
                return onfulfilled ? onfulfilled(null) : null;
              }
            };
          }
        };
      }
    };
  },

  delete(tableObj: any) {
    return {
      where(clause: any) {
        return {
          async then(onfulfilled?: (value: any) => any) {
            const data = loadData();
            const activeUserId = await getUserId();
            const { field, value } = clause;
            
            if (tableObj.name === "conversations") {
              // Validar pertenencia del usuario antes de borrar en cascada
              data.conversations = data.conversations.filter(
                (c) => !(c.id === value && c.userId === activeUserId)
              );
              data.messages = data.messages.filter(
                (m) => !(m.conversationId === value && m.userId === activeUserId)
              );
            } else {
              data.messages = data.messages.filter(
                (m: any) => !(m[field] === value && m.userId === activeUserId)
              );
            }
            
            saveData(data);
            return onfulfilled ? onfulfilled(null) : null;
          }
        };
      }
    };
  },

  execute(sqlObj: any) {
    return {
      async then(onfulfilled?: (value: any) => any) {
        const data = loadData();
        const activeUserId = await getUserId();
        
        // Contar cuestionarios respondidos filtrando por usuario activo
        const quizResults = data.messages
          .filter(
            m =>
              m.role === "assistant" &&
              m.metadata?.type === "quiz" &&
              m.metadata?.answered != null &&
              m.userId === activeUserId
          )
          .map(m => ({ metadata: m.metadata }));
          
        const result = { rows: quizResults };
        return onfulfilled ? onfulfilled(result) : result;
      }
    };
  }
};
=======
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
>>>>>>> 1256ef975a9f2d43e80bb7b5543bd3902a7f17c8
