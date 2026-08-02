import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const getSegments = () => {
  // Decode "public/images/exams" from base64 to hide it from the Turbopack compiler
  const decoded = Buffer.from("cHVibGljL2ltYWdlcy9leGFtcw==", "base64").toString("utf-8");
  return decoded.split("/");
};

function getOutDir(year: string) {
  const base = process.cwd();
  return path.join(base, ...getSegments(), year);
}

export async function POST(req: NextRequest) {
  const { from, to, year = "2024" } = await req.json();
  const outDir = getOutDir(year);
  const oldPath = path.join(outDir, from);
  const newPath = path.join(outDir, `pregunta_${to}.png`);
  try {
    await fs.rename(oldPath, newPath);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const year = req.nextUrl.searchParams.get("year") ?? "2024";
  const outDir = getOutDir(year);
  let files: string[] = [];
  try {
    const all = await fs.readdir(outDir);
    files = all.filter((f) => f.startsWith("temp_img_")).sort((a, b) => {
      const na = parseInt(a.replace("temp_img_", "").replace(".png", ""));
      const nb = parseInt(b.replace("temp_img_", "").replace(".png", ""));
      return na - nb;
    });
  } catch {}
  return NextResponse.json({ files, year });
}
