"use client";

import { useState, useEffect } from "react";
import type { Spot } from "@/types/spot";
import { getCategoryConfig } from "@/lib/categories";
import { toggleFavorite, isFavorite } from "@/lib/favorites";

interface SpotDetailProps {
  spot: Spot | null;
  onClose: () => void;
  userLocation: { lat: number; lng: number } | null;
}

export default function SpotDetail({ spot, onClose, userLocation }: SpotDetailProps) {
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    if (spot) setFavorited(isFavorite(spot.id));
  }, [spot]);

  if (!spot) return null;

  const config = getCategoryConfig(spot.category);

  const handleFavorite = () => {
    setFavorited(toggleFavorite(spot));
  };

  const googleMapsViewUrl = `https://www.google.com/maps?q=${spot.lat},${spot.lng}`;
  const googleMapsRouteUrl = userLocation
    ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${spot.lat},${spot.lng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`;
  const osmEditUrl = `https://www.openstreetmap.org/edit#map=18/${spot.lat}/${spot.lng}`;

  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0,
      background: "linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)",
      zIndex: 1000,
      borderRadius: "20px 20px 0 0",
      maxHeight: "65vh",
      overflowY: "auto",
      boxShadow: "0 -8px 32px rgba(0,0,0,0.5)",
      border: "1px solid rgba(255,255,255,0.08)",
    }}
    className="md:absolute md:top-0 md:right-0 md:bottom-0 md:left-auto md:w-80 md:rounded-none md:max-h-full"
    >
      {/* カラーバー */}
      <div style={{ height: "4px", background: `linear-gradient(90deg, ${config.bgColor}, ${config.bgColor}88)`, borderRadius: "20px 20px 0 0" }} />

      {/* ヘッダー */}
      <div style={{ padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
          <div style={{
            width: "44px", height: "44px", borderRadius: "12px",
            background: `${config.bgColor}22`,
            border: `1px solid ${config.bgColor}55`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "22px", flexShrink: 0,
          }}>
            {config.emoji}
          </div>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: "16px", color: "#fff", margin: "0 0 2px 0", lineHeight: 1.3 }}>
              {spot.name}
            </h2>
            <span style={{
              fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "6px",
              background: `${config.bgColor}33`, color: config.bgColor,
            }}>
              {config.label}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            width: "28px", height: "28px", borderRadius: "8px",
            background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)",
            border: "none", cursor: "pointer", fontSize: "16px",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}
        >×</button>
      </div>

      {/* 情報リスト */}
      <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {spot.address && (
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <span style={{ fontSize: "14px", flexShrink: 0, marginTop: "1px" }}>📍</span>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", margin: 0 }}>{spot.address}</p>
          </div>
        )}
        {spot.phone && (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span style={{ fontSize: "14px", flexShrink: 0 }}>📞</span>
            <a href={`tel:${spot.phone}`} style={{ fontSize: "13px", color: "#60a5fa", textDecoration: "none" }}>
              {spot.phone}
            </a>
          </div>
        )}
        {spot.website && (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span style={{ fontSize: "14px", flexShrink: 0 }}>🌐</span>
            <a href={spot.website} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: "13px", color: "#60a5fa", textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              ウェブサイトを開く
            </a>
          </div>
        )}
        {spot.openingHours && (
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <span style={{ fontSize: "14px", flexShrink: 0, marginTop: "1px" }}>🕐</span>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", margin: 0 }}>{spot.openingHours}</p>
          </div>
        )}

        {/* 区切り */}
        <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "2px 0" }} />

        {/* お気に入り */}
        <button onClick={handleFavorite} style={{
          width: "100%", padding: "10px", borderRadius: "12px",
          background: favorited ? "rgba(251,191,36,0.12)" : "rgba(255,255,255,0.05)",
          border: `1px solid ${favorited ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.1)"}`,
          color: favorited ? "#fbbf24" : "rgba(255,255,255,0.6)",
          fontSize: "13px", fontWeight: 600, cursor: "pointer",
        }}>
          {favorited ? "★ お気に入り済み" : "☆ お気に入りに追加"}
        </button>

        {/* Googleマップボタン */}
        <div style={{ display: "flex", gap: "8px" }}>
          <a href={googleMapsViewUrl} target="_blank" rel="noopener noreferrer" style={{
            flex: 1, padding: "10px 8px", borderRadius: "12px",
            background: "linear-gradient(135deg, #4285f4, #2563eb)",
            color: "#fff", fontSize: "12px", fontWeight: 600,
            textAlign: "center", textDecoration: "none",
            boxShadow: "0 2px 8px rgba(66,133,244,0.3)",
          }}>
            📍 地図で見る
          </a>
          <a href={googleMapsRouteUrl} target="_blank" rel="noopener noreferrer" style={{
            flex: 1, padding: "10px 8px", borderRadius: "12px",
            background: "linear-gradient(135deg, #16a34a, #15803d)",
            color: "#fff", fontSize: "12px", fontWeight: 600,
            textAlign: "center", textDecoration: "none",
            boxShadow: "0 2px 8px rgba(22,163,74,0.3)",
          }}>
            🚗 ルート案内
          </a>
        </div>

        {/* 情報登録 */}
        <a href={osmEditUrl} target="_blank" rel="noopener noreferrer" style={{
          width: "100%", padding: "10px", borderRadius: "12px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.45)", fontSize: "12px", fontWeight: 500,
          textAlign: "center", textDecoration: "none", display: "block",
        }}>
          ✏️ 情報を登録・修正する（OpenStreetMap）
        </a>

        {/* 注意書き */}
        <div style={{
          padding: "10px 12px", borderRadius: "10px",
          background: "rgba(251,191,36,0.06)",
          border: "1px solid rgba(251,191,36,0.15)",
        }}>
          <p style={{ fontSize: "11px", color: "rgba(251,191,36,0.7)", margin: 0, lineHeight: 1.6 }}>
            ⚠️ 掲載情報はOpenStreetMapのデータをもとにしており、最新でない場合があります。営業時間・ペット可否など、ご訪問前に必ずお店へご確認ください。
          </p>
        </div>
      </div>
    </div>
  );
}
