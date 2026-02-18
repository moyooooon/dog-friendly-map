import type { RouteInfo } from "@/types/spot";

const OSRM_BASE_URL = "https://router.project-osrm.org/route/v1/driving";

export interface LatLng {
  lat: number;
  lng: number;
}

export async function fetchRoute(from: LatLng, to: LatLng): Promise<RouteInfo> {
  const url = `${OSRM_BASE_URL}/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;

  const response = await fetch(url, {
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`ルート取得失敗: HTTP ${response.status}`);
  }

  const data = await response.json();

  if (data.code !== "Ok" || !data.routes?.[0]) {
    throw new Error("ルートが見つかりませんでした");
  }

  const route = data.routes[0];
  const geometry: [number, number][] = route.geometry.coordinates.map(
    ([lng, lat]: [number, number]) => [lat, lng]
  );

  return {
    distance: route.distance,
    duration: route.duration,
    geometry,
  };
}

export function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}分`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}時間${mins}分`;
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}
