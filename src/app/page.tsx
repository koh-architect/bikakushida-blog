"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Plant {
  slug: string;
  title: string;
  species?: string;
  status?: string;
  acquired_date?: string;
  location?: string;
  cover_image?: string;
  diary?: any[];
}

const STATUS_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  育成中:  { bg: "#e8f0e0", text: "#3a5a2a", border: "#7a9a6a" },
  要観察: { bg: "#f5ecd5", text: "#7a5a1a", border: "#c49a3a" },
  休眠中: { bg: "#e5edf0", text: "#2a4a5a", border: "#5a8a9a" },
  譲渡済み: { bg: "#ede9e5", text: "#5a4a3a", border: "#9a8a7a" },
};

export default function Home() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [sortBy, setSortBy] = useState<"acquired" | "updated">("acquired");

  useEffect(() => {
    fetch("/api/plants")
      .then((r) => r.json())
      .then((data) => setPlants(data));
  }, []);

  const sorted = [...plants].sort((a, b) => {
    if (sortBy === "acquired") {
      return (b.acquired_date || "").localeCompare(a.acquired_date || "");
    } else {
      const aLatest = (a.diary || []).map((d: any) => d.date || "").sort().reverse()[0] || a.acquired_date || "";
      const bLatest = (b.diary || []).map((d: any) => d.date || "").sort().reverse()[0] || b.acquired_date || "";
      return bLatest.localeCompare(aLatest);
    }
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Noto+Serif+JP:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background-color: #f2ede4; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E"); min-height: 100vh; font-family: 'Noto Serif JP', serif; }
        .page-wrapper { max-width: 1000px; margin: 0 auto; padding: 0 24px 80px; }
        .site-header { padding: 48px 0 36px; border-bottom: 1px solid #c8b89a; margin-bottom: 36px; position: relative; }
        .site-header::before { content: ''; position: absolute; bottom: -1px; left: 0; width: 60px; height: 3px; background: #4a7a3a; }
        .header-top { display: flex; align-items: center; gap: 24px; margin-bottom: 0; }
        .header-text { flex: 1; }
        .header-eyebrow { font-family: 'Playfair Display', serif; font-style: italic; font-size: 12px; color: #7a6a4a; letter-spacing: 0.15em; margin-bottom: 8px; }
        .site-title { font-family: 'Playfair Display', serif; font-size: clamp(24px, 4vw, 40px); font-weight: 600; color: #2a3a1a; line-height: 1.2; margin-bottom: 8px; }
        .site-title span { color: #4a7a3a; }
        .site-subtitle { font-size: 12px; color: #8a7a5a; letter-spacing: 0.08em; }
        .plant-count { display: inline-block; background: #4a7a3a; color: #f2ede4; font-size: 10px; padding: 2px 8px; border-radius: 2px; margin-left: 8px; letter-spacing: 0.05em; vertical-align: middle; }
        .sort-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 28px; }
        .sort-label { font-size: 11px; color: #9a8a6a; letter-spacing: 0.08em; }
        .sort-btn { font-family: 'Noto Serif JP', serif; font-size: 12px; padding: 5px 14px; border-radius: 2px; border: 1px solid #c8b89a; background: #faf6ef; color: #6a5a3a; cursor: pointer; transition: all 0.15s; letter-spacing: 0.05em; }
        .sort-btn:hover { background: #f0e8d8; }
        .sort-btn.active { background: #4a7a3a; color: #f2ede4; border-color: #4a7a3a; }
        .plant-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 28px; }
        .plant-card { background: #faf6ef; border: 1px solid #d4c4a8; border-radius: 4px; overflow: hidden; text-decoration: none; color: inherit; display: block; transition: transform 0.2s, box-shadow 0.2s; position: relative; box-shadow: 2px 2px 8px rgba(100,80,40,0.08); }
        .plant-card:hover { transform: translateY(-4px); box-shadow: 4px 8px 20px rgba(100,80,40,0.15); }
        .plant-card::after { content: ''; position: absolute; top: 6px; left: 6px; right: -6px; bottom: -6px; border: 1px solid #d4c4a8; border-radius: 4px; z-index: -1; opacity: 0.5; }
        .card-image { width: 100%; height: 200px; object-fit: cover; display: block; border-bottom: 1px solid #d4c4a8; filter: sepia(10%) contrast(95%); }
        .card-image-placeholder { width: 100%; height: 200px; background: linear-gradient(135deg, #e8e0d0 0%, #d8cdb8 100%); display: flex; align-items: center; justify-content: center; border-bottom: 1px solid #d4c4a8; font-size: 48px; color: #a89878; }
        .card-body { padding: 18px 20px 20px; }
        .card-status { display: inline-block; font-size: 10px; font-weight: 500; padding: 2px 9px; border-radius: 2px; letter-spacing: 0.08em; border: 1px solid; margin-bottom: 10px; }
        .card-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 600; color: #2a3a1a; margin-bottom: 4px; line-height: 1.3; }
        .card-species { font-style: italic; font-size: 12px; color: #8a7a5a; margin-bottom: 14px; }
        .card-meta { display: flex; gap: 10px; font-size: 11px; color: #9a8a6a; border-top: 1px dashed #d4c4a8; padding-top: 12px; flex-wrap: wrap; }
        .card-updated { font-size: 10px; color: #b8a88a; margin-left: auto; }
        .empty-state { text-align: center; padding: 80px 0; color: #9a8a6a; }
      `}</style>

      <div className="page-wrapper">
        <header className="site-header">
          <div className="header-top">
            {/* SVGロゴ */}
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
              <circle cx="40" cy="40" r="38" stroke="#c8b89a" strokeWidth="1" fill="#faf6ef"/>
              <circle cx="40" cy="40" r="36" stroke="#4a7a3a" strokeWidth="0.5" fill="none" strokeDasharray="2 4"/>
              {/* 貯水葉 左 */}
              <path d="M40 44 C30 38 18 35 12 25 C20 28 30 34 40 44Z" fill="#a8c898" opacity="0.7"/>
              {/* 貯水葉 右 */}
              <path d="M40 44 C50 38 62 35 68 25 C60 28 50 34 40 44Z" fill="#a8c898" opacity="0.7"/>
              {/* 胞子葉 左上 */}
              <path d="M38 42 C28 30 22 18 24 8 C28 16 34 28 38 42Z" fill="#4a7a3a"/>
              {/* 胞子葉 右上 */}
              <path d="M42 42 C52 30 58 18 56 8 C52 16 46 28 42 42Z" fill="#4a7a3a"/>
              {/* 胞子葉 左 */}
              <path d="M38 44 C24 40 12 36 8 26 C14 30 26 36 38 44Z" fill="#3a6a2a" opacity="0.9"/>
              {/* 胞子葉 右 */}
              <path d="M42 44 C56 40 68 36 72 26 C66 30 54 36 42 44Z" fill="#3a6a2a" opacity="0.9"/>
              {/* 着生点 */}
              <circle cx="40" cy="44" r="5" fill="#2a3a1a"/>
              <circle cx="40" cy="44" r="2.5" fill="#7ab87a"/>
              {/* 根 */}
              <path d="M38 49 C36 55 34 61 36 68" stroke="#4a7a3a" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
              <path d="M40 50 C40 57 40 63 40 70" stroke="#4a7a3a" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
              <path d="M42 49 C44 55 46 61 44 68" stroke="#4a7a3a" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
            </svg>
            <div className="header-text">
              <p className="header-eyebrow">Cultivation Journal</p>
              <h1 className="site-title"><span>Platycerium</span> 育成記録</h1>
              <p className="site-subtitle">
                我が家のビカクシダたち
                <span className="plant-count">{plants.length} 株</span>
              </p>
            </div>
          </div>
        </header>

        {/* 並び替えバー */}
        <div className="sort-bar">
          <span className="sort-label">並び替え：</span>
          <button className={`sort-btn ${sortBy === "acquired" ? "active" : ""}`} onClick={() => setSortBy("acquired")}>
            登録日順
          </button>
          <button className={`sort-btn ${sortBy === "updated" ? "active" : ""}`} onClick={() => setSortBy("updated")}>
            更新日順
          </button>
        </div>

        {plants.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 48 }}>🌿</div>
            <p style={{ marginTop: 12 }}>読み込み中...</p>
          </div>
        ) : (
          <div className="plant-grid">
            {sorted.map((plant) => {
              const statusStyle = STATUS_COLOR[plant.status ?? "育成中"] ?? STATUS_COLOR["育成中"];
              const diaryCount = (plant.diary || []).length;
              const latestDiary = (plant.diary || []).map((d: any) => d.date || "").sort().reverse()[0];
              return (
                <Link key={plant.slug} href={`/plants/${plant.slug}`} className="plant-card">
                  {plant.cover_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={plant.cover_image} alt={plant.title} className="card-image" />
                  ) : (
                    <div className="card-image-placeholder">🌿</div>
                  )}
                  <div className="card-body">
                    <span className="card-status" style={{ background: statusStyle.bg, color: statusStyle.text, borderColor: statusStyle.border }}>
                      {plant.status ?? "育成中"}
                    </span>
                    <h2 className="card-title">{plant.title}</h2>
                    <p className="card-species">{plant.species || "—"}</p>
                    <div className="card-meta">
                      {plant.acquired_date && <span>📅 {plant.acquired_date}</span>}
                      {plant.location && <span>📍 {plant.location}</span>}
                      {diaryCount > 0 && <span>📔 {diaryCount}件</span>}
                      {latestDiary && <span className="card-updated">更新: {latestDiary}</span>}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
