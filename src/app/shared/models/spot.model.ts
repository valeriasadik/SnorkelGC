export interface Spot {
  id: string;
  name: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  rating: number;
  reviews: number;
  description: string;
  imageUrl: string;
  badge?: 'RECOMMENDED' | 'MOST POPULAR' | 'BEST VISIBILITY' | 'CALM WATERS';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  conditions: RealtimeConditions;
  marineLife: MarineLife;
  facilities: Facility[];
  entryPoint: string;
  bestTimeToVisit?: string;
  /** Conditions quality score 1–10 from the realtime API */
  score?: number;
  accessibilityNotes?: string;
}

/** Shape of each spot in the GET /api/spots response: { spots: ApiSpotData[] } */
export interface ApiSpotData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  score: number;
  suitability: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  conditions: {
    waves: RealtimeConditions['waves'];
    waterTemp: RealtimeConditions['waterTemp'];
    weather: RealtimeConditions['weather'];
    visibility: RealtimeConditions['visibility'];
    wind: RealtimeConditions['wind'];
  };
  facilities: {
    parking: boolean;
    showers: boolean;
    restaurant: boolean;
    lifeguard: boolean;
  };
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description?: string;
  imageUrl?: string;
  entryPoint?: string;
  bestTime?: string;
  lastUpdated: string;
}

export interface RealtimeConditions {
  waves: {
    height: number;
    unit: 'm' | 'ft';
    level: 'Low' | 'Medium' | 'High';
    period?: number; // segundos — periodo de ola (importante para surge submarino)
  };
  waterTemp: {
    value: number;
    unit: '°C' | '°F';
  };
  weather: {
    condition: string;
    icon: string;
  };
  visibility: {
    status: 'Poor' | 'Fair' | 'Good' | 'Excellent';
    meters?: number;
  };
  wind: {
    speed: number;
    unit: 'km/h' | 'mph';
    direction?: string;
  };
  suitability: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  lastUpdated: Date;
}

export interface MarineLife {
  description: string;
  species: MarineSpecies[];
}

export interface MarineSpecies {
  name: string;
  commonName: string;
  icon?: string;
  rarity?: 'common' | 'uncommon' | 'rare';
}

export interface Facility {
  type: 'parking' | 'showers' | 'equipment-rental' | 'restaurant' | 'restrooms' | 'lifeguard';
  name: string;
  available: boolean;
  notes?: string;
}

export type ViewMode = 'list' | 'map';
export type FilterType = 'All' | 'North' | 'South' | 'Near Me';

export interface SpotFilter {
  region?: 'North' | 'South' | 'East' | 'West';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  minRating?: number;
  badge?: string;
  facilities?: string[];
}
