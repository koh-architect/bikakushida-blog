import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

// 株のデータをファイルから読み込む関数
function getPlants() {
  const dir = path.join(process.cwd(), "content/plants");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith(".md"))
    .map(filename => {
      const raw = fs.readFileSync(path.join(dir, filename), "utf-8");
      const { data } = matter(raw);
      return { slug: filename.replace(".md", ""), ...data };
    });
}

export default function Home() {
  const plants = getPlants();
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>🌿 ビカクシダ育成記録</h1>
      <p>我が家のビカクシダたち（{plants.length}株）</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {plants.map((plant: any) => (
          <Link key={plant.slug} href={`/plants/${plant.slug}`}
            style={{ border: "1px solid #ccc", borderRadius: 12, padding: 16, textDecoration: "none", color: "inherit" }}>
            <span style={{ fontSize: 12, background: "#e8f5e2", padding: "2px 8px", borderRadius: 99 }}>
              {plant.status}
            </span>
            <h2 style={{ margin: "8px 0 4px" }}>{plant.title}</h2>
            <p style={{ margin: 0, color: "#888", fontSize: 13 }}>{plant.species}</p>
            <p style={{ margin: "4px 0 0", color: "#aaa", fontSize: 12 }}>入手: {plant.acquired_date}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}