"use client";

import { CATEGORIES } from "@/lib/categories";
import type { CategoryId } from "@/types/spot";

interface CategoryFilterProps {
  activeCategories: Set<CategoryId>;
  onToggle: (id: CategoryId) => void;
}

export default function CategoryFilter({ activeCategories, onToggle }: CategoryFilterProps) {
  return (
    <div className="category-filter-wrap" style={{
      overflowX: "auto",
      overflowY: "hidden",
      background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      flexShrink: 0,
      scrollbarWidth: "none",
    }}>
      <div style={{
        display: "flex", gap: "8px",
        padding: "10px 12px",
        width: "max-content",
      }}>
      {CATEGORIES.map((cat) => {
        const isActive = activeCategories.has(cat.id);
        return (
          <button
            key={cat.id}
            onClick={() => onToggle(cat.id)}
            style={{
              display: "flex", alignItems: "center", gap: "5px",
              padding: "6px 12px", borderRadius: "20px",
              fontSize: "12px", fontWeight: 600,
              whiteSpace: "nowrap", flexShrink: 0,
              cursor: "pointer",
              transition: "all 0.2s",
              background: isActive ? cat.bgColor : "rgba(255,255,255,0.06)",
              color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
              border: `1px solid ${isActive ? "transparent" : "rgba(255,255,255,0.1)"}`,
              boxShadow: isActive ? `0 2px 8px ${cat.bgColor}55` : "none",
            }}
            aria-pressed={isActive}
          >
            <span style={{ fontSize: "13px" }}>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        );
      })}
      </div>
    </div>
  );
}
