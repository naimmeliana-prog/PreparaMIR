import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DB_FILE = path.join(process.cwd(), "public", "local_db.json");

export async function GET(req: NextRequest) {
  const userId = req.cookies.get("userId")?.value;

  if (!userId) {
    return NextResponse.json({ loggedIn: false });
  }

  // Leer base de datos local
  let dbData = { users: [] as any[] };
  if (fs.existsSync(DB_FILE)) {
    try {
      dbData = { ...dbData, ...JSON.parse(fs.readFileSync(DB_FILE, "utf-8")) };
    } catch {}
  }

  const user = dbData.users.find((u: any) => u.id === userId);
  if (!user) {
    return NextResponse.json({ loggedIn: false });
  }

  return NextResponse.json({ loggedIn: true, username: user.username });
}
