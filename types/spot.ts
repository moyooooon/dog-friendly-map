export type CategoryId =
  | "hotel_with_dog"
  | "dog_cafe"
  | "pet_hotel"
  | "grooming"
  | "pet_shop"
  | "dog_park"
  | "veterinary";

export interface Spot {
  id: string;
  name: string;
  category: CategoryId;
  lat: number;
  lng: number;
  address?: string;
  phone?: string;
  website?: string;
  openingHours?: string;
  tags: Record<string, string>;
}

export interface RouteInfo {
  distance: number;
  duration: number;
  geometry: [number, number][];
}

export interface FavoriteSpot extends Spot {
  savedAt: number;
}
