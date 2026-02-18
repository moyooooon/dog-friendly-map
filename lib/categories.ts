import type { CategoryId } from "@/types/spot";

export interface CategoryConfig {
  id: CategoryId;
  label: string;
  bgColor: string;
  emoji: string;
  osmQuery: string;
}

export const CATEGORIES: CategoryConfig[] = [
  {
    id: "hotel_with_dog",
    label: "犬と泊まれるホテル",
    bgColor: "#2563eb",
    emoji: "🏨",
    osmQuery: `
      node["tourism"="hotel"]["dog"="yes"](bbox);
      way["tourism"="hotel"]["dog"="yes"](bbox);
      node["tourism"="hotel"]["dog"="allowed"](bbox);
      way["tourism"="hotel"]["dog"="allowed"](bbox);
      node["tourism"="hotel"]["name"~"犬|ペット|DOG|dog",i](bbox);
      way["tourism"="hotel"]["name"~"犬|ペット|DOG|dog",i](bbox);
      node["tourism"="ryokan"]["dog"~"yes|allowed"](bbox);
      way["tourism"="ryokan"]["dog"~"yes|allowed"](bbox);
      node["tourism"="ryokan"]["name"~"犬|ペット|DOG|dog",i](bbox);
      way["tourism"="ryokan"]["name"~"犬|ペット|DOG|dog",i](bbox);
    `,
  },
  {
    id: "dog_cafe",
    label: "ドッグカフェ",
    bgColor: "#d97706",
    emoji: "☕",
    osmQuery: `
      node["amenity"="cafe"]["dog"="yes"](bbox);
      way["amenity"="cafe"]["dog"="yes"](bbox);
      node["amenity"="cafe"]["dog"="allowed"](bbox);
      way["amenity"="cafe"]["dog"="allowed"](bbox);
      node["amenity"="cafe"]["name"~"ドッグ|DOG|dog|犬",i](bbox);
      way["amenity"="cafe"]["name"~"ドッグ|DOG|dog|犬",i](bbox);
      node["amenity"="restaurant"]["dog"="yes"](bbox);
      way["amenity"="restaurant"]["dog"="yes"](bbox);
    `,
  },
  {
    id: "pet_hotel",
    label: "ペットホテル",
    bgColor: "#9333ea",
    emoji: "🐾",
    osmQuery: `
      node["amenity"="animal_boarding"](bbox);
      way["amenity"="animal_boarding"](bbox);
      node["shop"~"pet"]["name"~"ペットホテル|ペットホーム|犬|dog",i](bbox);
      way["shop"~"pet"]["name"~"ペットホテル|ペットホーム|犬|dog",i](bbox);
    `,
  },
  {
    id: "grooming",
    label: "トリミング",
    bgColor: "#ec4899",
    emoji: "✂️",
    osmQuery: `
      node["shop"="pet_grooming"](bbox);
      way["shop"="pet_grooming"](bbox);
    `,
  },
  {
    id: "pet_shop",
    label: "ペット用品店",
    bgColor: "#f97316",
    emoji: "🛒",
    osmQuery: `
      node["shop"="pet"](bbox);
      way["shop"="pet"](bbox);
    `,
  },
  {
    id: "dog_park",
    label: "ドッグラン",
    bgColor: "#16a34a",
    emoji: "🌳",
    osmQuery: `
      node["leisure"="dog_park"](bbox);
      way["leisure"="dog_park"](bbox);
    `,
  },
  {
    id: "veterinary",
    label: "動物病院",
    bgColor: "#dc2626",
    emoji: "🏥",
    osmQuery: `
      node["amenity"="veterinary"](bbox);
      way["amenity"="veterinary"](bbox);
    `,
  },
];

export const CATEGORY_MAP = new Map<CategoryId, CategoryConfig>(
  CATEGORIES.map((c) => [c.id, c])
);

export function getCategoryConfig(id: CategoryId): CategoryConfig {
  return CATEGORY_MAP.get(id) ?? CATEGORIES[0];
}
