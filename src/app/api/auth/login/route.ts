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

  // Validar usuario
  const user = dbData.users.find(
    (u: any) =>
      u.username.toLowerCase() === username.toLowerCase() &&
      u.password === password
  );

  if (!user) {
    return NextResponse.json(
      { error: "Usuario o contraseña incorrectos" },
      { status: 401 }
    );
  }

  // Settear la cookie de sesión
  const res = NextResponse.json({ ok: true, username: user.username });
  res.cookies.set("userId", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 semana
    path: "/",
  });

  return res;
}
