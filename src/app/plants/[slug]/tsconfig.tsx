import fs from "fs";
import path from "path";
import matter from "gray-matter";

export default function PlantPage({ params }: { params: { slug: string } }) {
  const file = path.join(process.cwd(), "content/plants", `${params.slug}.md`);
  const raw = fs.readFileSync(file, "utf-8");
  const { data } = matter(raw);

  const diary = (data.diary || []).sort(
    (a: any, b: any) => b.date.localeCompare(a.date)
  );

  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: 24 }}>
      <a href="/">← 一覧に戻る</a>
      <h1 style={{ marginTop: 16 }}>{data.title}</h1>
      <p style={{ color: "#888", fontStyle: "italic" }}>{data.species}</p>

      <div style={{ background: "#f5f5f5", borderRadius: 12, padding: 16, margin: "16px 0" }}>
        <p>📅 入手日: {data.acquired_date}</p>
        <p>📍 置き場所: {data.location}</p>
        <p>🪵 板付け素材: {data.mount}</p>
        <p>状態: {data.status}</p>
      </div>

      {data.description && <p>{data.description}</p>}

      <h2>📔 成長日誌</h2>
      {diary.map((entry: any, i: number) => (
        <div key={i} style={{ borderLeft: "4px solid #4caf50", paddingLeft: 16, marginBottom: 16 }}>
          <strong>{entry.type}</strong> — {entry.date}
          <p style={{ margin: "4px 0 0" }}>{entry.note}</p>
        </div>
      ))}
    </main>
  );
}