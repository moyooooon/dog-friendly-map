import type { Spot, CategoryId } from "@/types/spot";
import { CATEGORIES } from "@/lib/categories";

const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://lz4.overpass-api.de/api/interpreter",
  "https://z.overpass-api.de/api/interpreter",
];

export interface BoundingBox {
  south: number;
  west: number;
  north: number;
  east: number;
}

function buildOverpassQuery(bbox: BoundingBox): string {
  const bboxStr = `${bbox.south},${bbox.west},${bbox.north},${bbox.east}`;

  const queries = CATEGORIES.flatMap((cat) =>
    cat.osmQuery
      .split("\n")
      .map((q) => q.trim())
      .filter(Boolean)
      .map((q) => q.replace("(bbox)", `(${bboxStr})`))
  );

  return `[out:json][timeout:25];
(
  ${queries.join("\n  ")}
);
out center;`;
}

interface OsmElement {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

interface OverpassResponse {
  elements: OsmElement[];
}

const DOG_HOTEL_NAME_RE = /犬|ペット|dog/i;
const DOG_CAFE_NAME_RE = /ドッグ|dog|犬/i;

function detectCategory(tags: Record<string, string>): CategoryId | null {
  if (tags["amenity"] === "veterinary") return "veterinary";
  if (tags["leisure"] === "dog_park") return "dog_park";
  if (tags["shop"] === "pet_grooming") return "grooming";
  if (tags["amenity"] === "animal_boarding") return "pet_hotel";

  const tourism = tags["tourism"];
  const amenity = tags["amenity"];
  const name = tags["name"] ?? tags["name:ja"] ?? "";
  const dog = tags["dog"];

  // 犬と泊まれるホテル・旅館：タグ or 名前で判定
  if (
    (tourism === "hotel" || tourism === "ryokan") &&
    (dog === "yes" || dog === "allowed" || DOG_HOTEL_NAME_RE.test(name))
  )
    return "hotel_with_dog";

  // ドッグカフェ・ペット可カフェ・レストラン
  if (
    (amenity === "cafe" || amenity === "restaurant") &&
    (dog === "yes" || dog === "allowed" || DOG_CAFE_NAME_RE.test(name))
  )
    return "dog_cafe";

  // ペットホテル：名前に含むケース
  if (
    tags["amenity"] === "animal_boarding" ||
    (/ペットホテル|ペットホーム/.test(name) && tags["shop"]?.includes("pet"))
  )
    return "pet_hotel";

  if (tags["shop"] === "pet") return "pet_shop";

  return null;
}

function osmElementToSpot(
  element: OsmElement,
  category: CategoryId
): Spot | null {
  const lat = element.type === "node" ? element.lat : element.center?.lat;
  const lng = element.type === "node" ? element.lon : element.center?.lon;

  if (lat == null || lng == null) return null;

  const tags = element.tags ?? {};
  const name = tags["name"] ?? tags["name:ja"] ?? tags["brand"] ?? "名称不明";

  const addressParts = [
    tags["addr:province"],
    tags["addr:city"],
    tags["addr:quarter"],
    tags["addr:street"],
    tags["addr:housenumber"],
  ].filter(Boolean);
  const address = tags["addr:full"] ?? (addressParts.length > 0 ? addressParts.join("") : undefined);

  return {
    id: `${element.type}/${element.id}`,
    name,
    category,
    lat,
    lng,
    address,
    phone: tags["contact:phone"] ?? tags["phone"] ?? undefined,
    website: tags["contact:website"] ?? tags["website"] ?? undefined,
    openingHours: tags["opening_hours"] ?? undefined,
    tags,
  };
}

export async function fetchSpots(bbox: BoundingBox): Promise<Spot[]> {
  const query = buildOverpassQuery(bbox);

  let lastError: Error | null = null;
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `data=${encodeURIComponent(query)}`,
        signal: AbortSignal.timeout(30000),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: OverpassResponse = await response.json();

      const spots: Spot[] = [];
      for (const element of data.elements) {
        const tags = element.tags ?? {};
        const category = detectCategory(tags);
        if (!category) continue;
        const spot = osmElementToSpot(element, category);
        if (spot) spots.push(spot);
      }

      return spots;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`Overpass endpoint ${endpoint} failed:`, lastError.message);
    }
  }

  throw lastError ?? new Error("全Overpassエンドポイントが失敗しました");
}
