import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const serializeData = (obj: any): any => {
  if (obj instanceof Date) return obj.toISOString().split("T")[0];
  if (Array.isArray(obj)) return obj.map(serializeData);
  if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, serializeData(v)])
    );
  }
  return obj;
};

export async function GET() {
  const dir = path.join(process.cwd(), "content/plants");
  if (!fs.existsSync(dir)) return NextResponse.json([]);

  const plants = fs.readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(dir, filename), "utf-8");
      const { data } = matter(raw);
      return { slug: filename.replace(".md", ""), ...serializeData(data) };
    });

  return NextResponse.json(plants);
}