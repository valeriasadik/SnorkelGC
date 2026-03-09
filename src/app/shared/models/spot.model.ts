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
