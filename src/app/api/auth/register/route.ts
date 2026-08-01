import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DB_FILE = path.join(process.cwd(), "public", "local_db.json");

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  // Leer base de datos local
  let dbData = { conversations: [], messages: [], users: [] as any[] };
  if (fs.existsSync(DB_FILE)) {
    try {
      dbData = { ...dbData, ...JSON.parse(fs.readFileSync(DB_FILE, "utf-8")) };
    } catch {}
  }

  // Comprobar si el usuario ya existe
  const exists = dbData.users.some(
    (u: any) => u.username.toLowerCase() === username.toLowerCase()
  );
  if (exists) {
    return NextResponse.json({ error: "El usuario ya existe" }, { status: 409 });
  }

  // Crear nuevo usuario (con ID único)
  const newUser = {
    id: "user-" + Math.random().toString(36).substring(2, 15),
    username,
    password, // En desarrollo local guardamos simple
  };

  dbData.users.push(newUser);
  fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), "utf-8");

  // Crear respuesta y setear la cookie de sesión
  const res = NextResponse.json({ ok: true, username: newUser.username });
  res.cookies.set("userId", newUser.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 semana
    path: "/",
  });

  return res;
}
