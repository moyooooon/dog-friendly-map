"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import type { Map as LeafletMap, LatLngBounds } from "leaflet";
import type { Spot, CategoryId } from "@/types/spot";
import { fetchSpots, type BoundingBox } from "@/lib/overpass";
import { getCategoryConfig } from "@/lib/categories";

if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

function createCategoryIcon(categoryId: CategoryId): L.DivIcon {
  const config = getCategoryConfig(categoryId);
  return L.divIcon({
    html: `<div style="
      width:36px;height:36px;
      background-color:${config.bgColor};
      border:3px solid white;
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-size:16px;
      box-shadow:0 3px 8px rgba(0,0,0,0.35);
      transition:transform 0.15s;
    ">${config.emoji}</div>`,
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
}

const currentLocationIcon = L.divIcon({
  html: `<div style="
    width:18px;height:18px;
    background:#3b82f6;border:3px solid white;
    border-radius:50%;
    box-shadow:0 0 0 5px rgba(59,130,246,0.25);
  "></div>`,
  className: "",
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

// 現在地取得後にマップを移動させるコンポーネント
function LocationFlyTo({ userLocation }: { userLocation: { lat: number; lng: number } | null }) {
  const map = useMap();
  const hasFlown = useRef(false);

  useEffect(() => {
    if (userLocation && !hasFlown.current) {
      hasFlown.current = true;
      map.flyTo([userLocation.lat, userLocation.lng], 14, { duration: 1.5 });
    }
  }, [userLocation, map]);

  return null;
}

function MapEventHandler({
  onBoundsChange,
  onCenterChange,
}: {
  onBoundsChange: (bounds: LatLngBounds) => void;
  onCenterChange: (center: { lat: number; lng: number }) => void;
}) {
  const boundsRef = useRef(onBoundsChange);
  boundsRef.current = onBoundsChange;
  const centerRef = useRef(onCenterChange);
  centerRef.current = onCenterChange;

  const map = useMapEvents({
    moveend: () => {
      boundsRef.current(map.getBounds());
      const c = map.getCenter();
      centerRef.current({ lat: c.lat, lng: c.lng });
    },
    zoomend: () => boundsRef.current(map.getBounds()),
    load: () => boundsRef.current(map.getBounds()),
  });
  return null;
}

interface MapProps {
  activeCategories: Set<CategoryId>;
  onSpotSelect: (spot: Spot | null) => void;
  selectedSpot: Spot | null;
  onUserLocation: (loc: { lat: number; lng: number } | null) => void;
  spots: Spot[];
  onSpotsUpdate: (spots: Spot[]) => void;
  onLoadingChange: (loading: boolean) => void;
  onError: (error: string | null) => void;
  userLocation: { lat: number; lng: number } | null;
  onCenterChange: (center: { lat: number; lng: number }) => void;
}

export default function Map({
  activeCategories,
  onSpotSelect,
  selectedSpot,
  onUserLocation,
  spots,
  onSpotsUpdate,
  onLoadingChange,
  onError,
  userLocation,
  onCenterChange,
}: MapProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const fetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 現在地取得（マップ表示直後に実行）
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        onUserLocation(null);
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }, [onUserLocation]);

  const handleBoundsChange = useCallback(
    (bounds: LatLngBounds) => {
      if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);

      fetchTimeoutRef.current = setTimeout(async () => {
        const bbox: BoundingBox = {
          south: bounds.getSouth(),
          west: bounds.getWest(),
          north: bounds.getNorth(),
          east: bounds.getEast(),
        };

        const latSpan = bbox.north - bbox.south;
        const lngSpan = bbox.east - bbox.west;
        if (latSpan > 0.5 || lngSpan > 0.5) {
          onError("ズームインしてスポットを表示してください");
          return;
        }

        onLoadingChange(true);
        onError(null);
        try {
          const newSpots = await fetchSpots(bbox);
          onSpotsUpdate(newSpots);
        } catch (err) {
          onError("スポットの取得に失敗しました。しばらく待ってから再試行してください。");
          console.error(err);
        } finally {
          onLoadingChange(false);
        }
      }, 800);
    },
    [onSpotsUpdate, onLoadingChange, onError]
  );

  const visibleSpots = spots.filter((s) => activeCategories.has(s.category));

  return (
    <MapContainer
      center={[35.6812, 139.7671]}
      zoom={12}
      className="w-full h-full"
      ref={mapRef}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />

      {/* 現在地取得後にスムーズに移動 */}
      <LocationFlyTo userLocation={userLocation} />

      <MapEventHandler onBoundsChange={handleBoundsChange} onCenterChange={onCenterChange} />

      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={currentLocationIcon}>
          <Popup>現在地</Popup>
        </Marker>
      )}

      {visibleSpots.map((spot) => (
        <Marker
          key={spot.id}
          position={[spot.lat, spot.lng]}
          icon={createCategoryIcon(spot.category)}
          eventHandlers={{ click: () => onSpotSelect(spot) }}
        >
          <Popup>
            <strong>{spot.name}</strong>
            <br />
            <span style={{ fontSize: "12px", color: "#6b7280" }}>
              {getCategoryConfig(spot.category).label}
            </span>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
