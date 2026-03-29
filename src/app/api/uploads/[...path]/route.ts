import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import { join } from "path";

const MIME_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;
  const safePath = segments.join("/").replace(/\.\./g, "");
  const filepath = join(process.cwd(), "uploads", safePath);

  try {
    const info = await stat(filepath);
    if (!info.isFile()) throw new Error("Not a file");

    const ext = safePath.split(".").pop()?.toLowerCase() || "";
    const contentType = MIME_TYPES[ext];
    if (!contentType) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const buffer = await readFile(filepath);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
