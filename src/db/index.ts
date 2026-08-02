import fs from "fs";
import path from "path";
import { cookies } from "next/headers";
import * as schema from "./schema";

// Archivo local de almacenamiento (fallback offline)
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
    return undefined;
  }
}

// Carga inicial/creación del archivo local
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

let getDrizzleTableName: any = null;
try {
  getDrizzleTableName = require("drizzle-orm").getTableName;
} catch {}

function getTableName(tableObj: any): string {
  if (!tableObj) return "";
  if (typeof tableObj === "string") return tableObj;
  
  if (getDrizzleTableName) {
    try {
      const name = getDrizzleTableName(tableObj);
      if (name) return name;
    } catch {}
  }
  
  if (tableObj._?.name) return tableObj._.name;
  if (tableObj.name) return tableObj.name;
  return "";
}

// Conexión reutilizable a PostgreSQL en producción
let pgDbInstance: any = null;
let pgPoolInstance: any = null;

function getPgDb() {
  if (!process.env.DATABASE_URL) return null;
  if (!pgDbInstance) {
    const { drizzle } = require("drizzle-orm/node-postgres");
    const { Pool } = require("pg");
    pgPoolInstance = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
    });
    pgDbInstance = drizzle(pgPoolInstance, { schema });
  }
  return pgDbInstance;
}

// Query builder unificado para Postgres (Drizzle) y JSON local
class HybridQueryBuilder {
  private table: string;
  private selectFields: any;
  private whereClause: any = null;
  private orderClause: any = null;

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
    const activeUserId = await getUserId();
    const pgDb = getPgDb();

    if (pgDb) {
      try {
        // MODO POSTGRESQL (PRODUCCIÓN)
        const { eq, and, inArray, asc, desc } = require("drizzle-orm");
        const tableObj = (schema as any)[this.table];

        let query: any;
        if (this.selectFields) {
          query = pgDb.select(this.selectFields).from(tableObj);
        } else {
          query = pgDb.select().from(tableObj);
        }

        const conditions: any[] = [];
        if (activeUserId && this.table !== "users") {
          conditions.push(eq(tableObj.userId, activeUserId));
        }

        if (this.whereClause) {
          const { field, value, operator } = this.whereClause;
          const col = tableObj[field];
          if (operator === "eq") {
            conditions.push(eq(col, value));
          } else if (operator === "inArray") {
            conditions.push(inArray(col, value));
          }
        }

        if (conditions.length > 0) {
          query = query.where(and(...conditions));
        }

        if (this.orderClause) {
          const { field, direction } = this.orderClause;
          const col = tableObj[field];
          query = query.orderBy(direction === "desc" ? desc(col) : asc(col));
        }

        const rows = await query;
        return onfulfilled ? onfulfilled(rows) : rows;
      } catch (err: any) {
        console.warn("⚠️ PostgreSQL SELECT failed, falling back to local JSON DB:", err.message);
      }
    } else {
      // MODO OFFLINE LOCAL (JSON)
      const data = loadData();
      let rows = this.table === "conversations" ? [...data.conversations] : [...data.messages];

      if (activeUserId) {
        rows = rows.filter((r: any) => r.userId === activeUserId);
      } else {
        rows = [];
      }

      if (this.whereClause) {
        const { field, value, operator } = this.whereClause;
        if (operator === "eq") {
          rows = rows.filter((r: any) => r[field] === value);
        } else if (operator === "inArray") {
          const valSet = new Set(value);
          rows = rows.filter((r: any) => valSet.has(r[field]));
        }
      }

      let resultRows = rows.map((r: any) => ({
        ...r,
        createdAt: new Date(r.createdAt),
        updatedAt: r.updatedAt ? new Date(r.updatedAt) : undefined,
      }));

      if (this.orderClause) {
        const { field, direction } = this.orderClause;
        resultRows.sort((a: any, b: any) => {
          const valA = a[field] instanceof Date ? a[field].getTime() : 0;
          const valB = b[field] instanceof Date ? b[field].getTime() : 0;
          return direction === "desc" ? valB - valA : valA - valB;
        });
      }

      if (this.selectFields && this.selectFields.value) {
        return onfulfilled ? onfulfilled([{ value: resultRows.length }]) : [{ value: resultRows.length }];
      }

      return onfulfilled ? onfulfilled(resultRows) : resultRows;
    }
  }
}

export const db = {
  select(fields?: any) {
    return {
      from(tableObj: any) {
        return new HybridQueryBuilder(getTableName(tableObj), fields);
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
                const activeUserId = await getUserId();
                const pgDb = getPgDb();
                const tableName = getTableName(tableObj);

                if (pgDb) {
                  try {
                    // MODO POSTGRESQL (PRODUCCIÓN)
                    const tableSchemaObj = (schema as any)[tableName];
                    const insertPayload = {
                      userId: activeUserId,
                      ...payload,
                    };
                    const [row] = await pgDb
                      .insert(tableSchemaObj)
                      .values(insertPayload)
                      .returning();
                    return onfulfilled ? onfulfilled([row]) : [row];
                  } catch (err: any) {
                    console.warn("⚠️ PostgreSQL INSERT failed, falling back to local JSON DB:", err.message);
                  }
                } else {
                  // MODO OFFLINE LOCAL (JSON)
                  const data = loadData();
                  const newRow: any = {
                    id: generateUUID(),
                    createdAt: new Date().toISOString(),
                    userId: activeUserId,
                    ...payload,
                  };
                  
                  if (tableName === "conversations") {
                    newRow.updatedAt = new Date().toISOString();
                    data.conversations.push(newRow);
                  } else if (tableName === "users") {
                    if (!data.users) data.users = [];
                    data.users.push(newRow);
                  } else {
                    data.messages.push(newRow);
                  }
                  
                  saveData(data);

                  const returnRow = {
                    ...newRow,
                    createdAt: new Date(newRow.createdAt),
                    updatedAt: newRow.updatedAt ? new Date(newRow.updatedAt) : undefined,
                  };
                  return onfulfilled ? onfulfilled([returnRow]) : [returnRow];
                }
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
                const activeUserId = await getUserId();
                const pgDb = getPgDb();
                const tableName = getTableName(tableObj);
                const { field, value } = clause;

                if (pgDb) {
                  try {
                    // MODO POSTGRESQL (PRODUCCIÓN)
                    const { eq, and } = require("drizzle-orm");
                    const tableSchemaObj = (schema as any)[tableName];
                    const conditions = [eq(tableSchemaObj[field], value)];
                    if (activeUserId && tableName !== "users") {
                      conditions.push(eq(tableSchemaObj.userId, activeUserId));
                    }
                    await pgDb
                      .update(tableSchemaObj)
                      .set(payload)
                      .where(and(...conditions));
                    return onfulfilled ? onfulfilled(null) : null;
                  } catch (err: any) {
                    console.warn("⚠️ PostgreSQL UPDATE failed, falling back to local JSON DB:", err.message);
                  }
                } else {
                  // MODO OFFLINE LOCAL (JSON)
                  const data = loadData();
                  const rows = tableName === "conversations" ? data.conversations : data.messages;
                  
                  for (const r of rows as any[]) {
                    if (r[field] === value && (!activeUserId || r.userId === activeUserId)) {
                      Object.assign(r, payload);
                      if (tableName === "conversations") {
                        r.updatedAt = new Date().toISOString();
                      }
                    }
                  }
                  saveData(data);
                  return onfulfilled ? onfulfilled(null) : null;
                }
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
            const activeUserId = await getUserId();
            const pgDb = getPgDb();
            const tableName = getTableName(tableObj);
            const { field, value } = clause;

            if (pgDb) {
              try {
                // MODO POSTGRESQL (PRODUCCIÓN)
                const { eq, and } = require("drizzle-orm");
                const tableSchemaObj = (schema as any)[tableName];
                const conditions = [eq(tableSchemaObj[field], value)];
                if (activeUserId && tableName !== "users") {
                  conditions.push(eq(tableSchemaObj.userId, activeUserId));
                }
                await pgDb.delete(tableSchemaObj).where(and(...conditions));
                return onfulfilled ? onfulfilled(null) : null;
              } catch (err: any) {
                console.warn("⚠️ PostgreSQL DELETE failed, falling back to local JSON DB:", err.message);
              }
            } else {
              // MODO OFFLINE LOCAL (JSON)
              const data = loadData();
              if (tableName === "conversations") {
                data.conversations = data.conversations.filter(
                  (c) => !(c.id === value && (!activeUserId || c.userId === activeUserId))
                );
                data.messages = data.messages.filter(
                  (m) => !(m.conversationId === value && (!activeUserId || m.userId === activeUserId))
                );
              } else {
                data.messages = data.messages.filter(
                  (m: any) => !(m[field] === value && (!activeUserId || m.userId === activeUserId))
                );
              }
              saveData(data);
              return onfulfilled ? onfulfilled(null) : null;
            }
          }
        };
      }
    };
  },

  execute(sqlObj: any) {
    return {
      async then(onfulfilled?: (value: any) => any) {
        const activeUserId = await getUserId();
        const pgDb = getPgDb();

        if (pgDb) {
          try {
            // MODO POSTGRESQL (PRODUCCIÓN)
            const result = await pgDb.execute(sqlObj);
            return onfulfilled ? onfulfilled(result) : result;
          } catch (err: any) {
            console.warn("⚠️ PostgreSQL EXECUTE failed, falling back to local JSON DB:", err.message);
          }
        } else {
          // MODO OFFLINE LOCAL (JSON)
          const data = loadData();
          const quizResults = data.messages
            .filter(
              m =>
                m.role === "assistant" &&
                m.metadata?.type === "quiz" &&
                m.metadata?.answered != null &&
                (!activeUserId || m.userId === activeUserId)
            )
            .map(m => ({ metadata: m.metadata }));
            
          const result = { rows: quizResults };
          return onfulfilled ? onfulfilled(result) : result;
        }
      }
    };
  }
};
