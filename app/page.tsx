"use client";

import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import type { CategoryId, Spot } from "@/types/spot";
import CategoryFilter from "@/components/CategoryFilter";
import SpotDetail from "@/components/SpotDetail";
import FavoritesList from "@/components/FavoritesList";
import { CATEGORIES } from "@/lib/categories";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div style={{
      display: "flex", height: "100%", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    }}>
      <div style={{ textAlign: "center", color: "#fff" }}>
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>🗺️</div>
        <p style={{ fontSize: "16px", opacity: 0.9, margin: 0 }}>地図を読み込み中...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const [activeCategories, setActiveCategories] = useState<Set<CategoryId>>(
    new Set(CATEGORIES.map((c) => c.id))
  );
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 35.6812, lng: 139.7671 });

  const handleCategoryToggle = useCallback((id: CategoryId) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSpotSelect = useCallback((spot: Spot | null) => {
    setSelectedSpot(spot);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", minHeight: "100vh", background: "#0f0f1a" }}>
      {/* ヘッダー */}
      <header style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        padding: "0 12px",
        height: "52px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        gap: "8px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0, flex: 1 }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "9px",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(102,126,234,0.4)",
            flexShrink: 0,
          }}>
            {/* Paw print icon (CC0) */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 100 100" fill="white">
              <ellipse cx="30" cy="18" rx="10" ry="13" />
              <ellipse cx="70" cy="18" rx="10" ry="13" />
              <ellipse cx="14" cy="42" rx="8" ry="11" />
              <ellipse cx="86" cy="42" rx="8" ry="11" />
              <path d="M50 38 C28 38 18 55 20 70 C22 82 32 90 50 90 C68 90 78 82 80 70 C82 55 72 38 50 38 Z" />
            </svg>
          </div>
          <h1 style={{
            fontWeight: 700, fontSize: "14px", color: "#fff", margin: 0,
            letterSpacing: "0.2px", whiteSpace: "nowrap",
            overflow: "hidden", textOverflow: "ellipsis",
          }}>
            犬とお出かけマップ
          </h1>
        </div>
        <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
          <a
            href={`https://www.openstreetmap.org/edit#map=16/${mapCenter.lat}/${mapCenter.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: "4px",
              padding: "6px 10px", borderRadius: "18px",
              background: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.65)",
              fontSize: "12px", fontWeight: 600,
              border: "1px solid rgba(255,255,255,0.1)",
              textDecoration: "none", whiteSpace: "nowrap",
            }}
          >
            ✏️ 登録
          </a>
          <button
            onClick={() => setShowFavorites((v) => !v)}
            style={{
              display: "flex", alignItems: "center", gap: "4px",
              padding: "6px 10px", borderRadius: "18px",
              background: showFavorites
                ? "linear-gradient(135deg, #f59e0b, #d97706)"
                : "rgba(255,255,255,0.08)",
              color: showFavorites ? "#fff" : "rgba(255,255,255,0.65)",
              fontSize: "12px", fontWeight: 600,
              border: `1px solid ${showFavorites ? "transparent" : "rgba(255,255,255,0.1)"}`,
              cursor: "pointer", whiteSpace: "nowrap",
            }}
          >
            ★ お気に入り
          </button>
        </div>
      </header>

      {/* カテゴリフィルター */}
      <CategoryFilter activeCategories={activeCategories} onToggle={handleCategoryToggle} />

      {/* 地図エリア */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {/* ローディング */}
        {loading && (
          <div style={{
            position: "absolute", top: "16px", left: "50%", transform: "translateX(-50%)",
            zIndex: 1000,
            background: "rgba(15,15,26,0.85)",
            backdropFilter: "blur(8px)",
            color: "#fff",
            padding: "8px 18px", borderRadius: "20px",
            fontSize: "13px", fontWeight: 500,
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
            whiteSpace: "nowrap",
          }}>
            ⟳ スポットを検索中...
          </div>
        )}

        {/* エラー */}
        {error && (
          <div style={{
            position: "absolute", top: "16px", left: "50%", transform: "translateX(-50%)",
            zIndex: 1000,
            background: "rgba(251,191,36,0.12)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(251,191,36,0.35)",
            color: "#fbbf24",
            padding: "8px 18px", borderRadius: "20px",
            fontSize: "13px", fontWeight: 500,
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            whiteSpace: "nowrap",
          }}>
            ⚠ {error}
          </div>
        )}

        <Map
          activeCategories={activeCategories}
          onSpotSelect={handleSpotSelect}
          selectedSpot={selectedSpot}
          onUserLocation={setUserLocation}
          spots={spots}
          onSpotsUpdate={setSpots}
          onLoadingChange={setLoading}
          onError={setError}
          userLocation={userLocation}
          onCenterChange={setMapCenter}
        />

        {/* 常時注意書き */}
        <div style={{
          position: "absolute", bottom: "12px", left: "50%", transform: "translateX(-50%)",
          zIndex: 999,
          background: "rgba(15,15,26,0.75)",
          backdropFilter: "blur(6px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px",
          padding: "5px 12px",
          fontSize: "11px", color: "rgba(255,255,255,0.4)",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          maxWidth: "calc(100vw - 32px)",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
          ⚠ 情報が最新でない場合があります。ご訪問前に必ずご確認ください。
        </div>

        {selectedSpot && (
          <SpotDetail
            spot={selectedSpot}
            onClose={() => handleSpotSelect(null)}
            userLocation={userLocation}
          />
        )}

        <FavoritesList
          isOpen={showFavorites}
          onClose={() => setShowFavorites(false)}
          onSpotSelect={(spot) => {
            handleSpotSelect(spot);
            setShowFavorites(false);
          }}
        />
      </div>
    </div>
  );
}
