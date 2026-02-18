import type { Spot, FavoriteSpot } from "@/types/spot";

const STORAGE_KEY = "dog-friendly-map:favorites";

export function getFavorites(): FavoriteSpot[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as FavoriteSpot[];
  } catch {
    return [];
  }
}

export function isFavorite(spotId: string): boolean {
  return getFavorites().some((f) => f.id === spotId);
}

export function addFavorite(spot: Spot): void {
  const favorites = getFavorites();
  if (favorites.some((f) => f.id === spot.id)) return;
  const updated: FavoriteSpot[] = [...favorites, { ...spot, savedAt: Date.now() }];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function removeFavorite(spotId: string): void {
  const updated = getFavorites().filter((f) => f.id !== spotId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function toggleFavorite(spot: Spot): boolean {
  if (isFavorite(spot.id)) {
    removeFavorite(spot.id);
    return false;
  } else {
    addFavorite(spot);
    return true;
  }
}
