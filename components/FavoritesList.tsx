"use client";

import { useState, useEffect } from "react";
import type { FavoriteSpot, CategoryId } from "@/types/spot";
import { getFavorites, removeFavorite } from "@/lib/favorites";
import { getCategoryConfig } from "@/lib/categories";

interface FavoritesListProps {
  isOpen: boolean;
  onClose: () => void;
  onSpotSelect: (spot: FavoriteSpot) => void;
}

export default function FavoritesList({ isOpen, onClose, onSpotSelect }: FavoritesListProps) {
  const [favorites, setFavorites] = useState<FavoriteSpot[]>([]);

  useEffect(() => {
    if (isOpen) setFavorites(getFavorites());
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRemove = (spotId: string) => {
    removeFavorite(spotId);
    setFavorites((prev) => prev.filter((f) => f.id !== spotId));
  };

  return (
    <div style={{
      position: "absolute", top: 0, right: 0, bottom: 0, width: "280px",
      background: "linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)",
      zIndex: 1001,
      display: "flex", flexDirection: "column",
      borderLeft: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "-8px 0 32px rgba(0,0,0,0.4)",
    }}>
      {/* ヘッダー */}
      <div style={{
        padding: "16px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(251,191,36,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "16px" }}>★</span>
          <h2 style={{ fontWeight: 700, fontSize: "15px", color: "#fbbf24", margin: 0 }}>お気に入り</h2>
        </div>
        <button onClick={onClose} style={{
          width: "28px", height: "28px", borderRadius: "8px",
          background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)",
          border: "none", cursor: "pointer", fontSize: "16px",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>×</button>
      </div>

      {/* リスト */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {favorites.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center" }}>
            <p style={{ fontSize: "36px", margin: "0 0 12px 0" }}>🐾</p>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: "0 0 6px 0" }}>
              お気に入りはまだありません
            </p>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", margin: 0 }}>
              スポットの詳細から追加できます
            </p>
          </div>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: "8px 0" }}>
            {favorites.map((spot) => {
              const config = getCategoryConfig(spot.category as CategoryId);
              return (
                <li key={spot.id} style={{
                  padding: "10px 16px",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}>
                  <button
                    onClick={() => { onSpotSelect(spot); onClose(); }}
                    style={{
                      width: "100%", textAlign: "left", background: "none",
                      border: "none", cursor: "pointer", padding: 0,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "36px", height: "36px", borderRadius: "10px",
                        background: `${config.bgColor}22`,
                        border: `1px solid ${config.bgColor}44`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "16px", flexShrink: 0,
                      }}>
                        {config.emoji}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: "13px", fontWeight: 600, color: "#fff", margin: "0 0 2px 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {spot.name}
                        </p>
                        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: 0 }}>
                          {config.label}
                        </p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleRemove(spot.id)}
                    style={{
                      marginTop: "6px", marginLeft: "46px",
                      fontSize: "11px", color: "rgba(239,68,68,0.6)",
                      background: "none", border: "none", cursor: "pointer", padding: 0,
                    }}
                  >
                    削除
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
