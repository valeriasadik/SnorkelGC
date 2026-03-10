import { Injectable, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Spot, SpotFilter, RealtimeConditions, ApiSpotData, Facility } from '../../shared/models';
import { environment } from '../../../environments/environment';

const CACHE_KEY = 'snorkel_spots_cache';
const FAVORITES_KEY = 'snorkel_favorites';

interface SpotsCache {
  spots: Spot[];
  timestamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class SpotsService {
  // ─── State ──────────────────────────────────────────────────────────────────
  private spotsSignal = signal<Spot[]>([]);
  private favoriteIdsSignal = signal<string[]>([]);
  private filterSignal = signal<SpotFilter>({});
  private isOfflineSignal = signal(false);
  private cacheTimestampSignal = signal<number | null>(null);

  // ─── Public computed ─────────────────────────────────────────────────────────
  spots = computed(() => this.spotsSignal());
  favoriteIds = computed(() => this.favoriteIdsSignal());
  isOffline = computed(() => this.isOfflineSignal());

  /** Hours since the cached data was saved (null when online / no cache) */
  cacheAgeHours = computed(() => {
    const ts = this.cacheTimestampSignal();
    if (!ts || !this.isOfflineSignal()) return null;
    return Math.round(((Date.now() - ts) / (1000 * 60 * 60)) * 10) / 10;
  });

  filteredSpots = computed(() => {
    const allSpots = this.spotsSignal();
    const filter = this.filterSignal();
    return this.applyFilter(allSpots, filter);
  });

  favoriteSpots = computed(() => {
    const allSpots = this.spotsSignal();
    const favIds = this.favoriteIdsSignal();
    return allSpots.filter(spot => favIds.includes(spot.id));
  });

  constructor(private http: HttpClient) {
    this.loadSpots();
    this.loadFavoritesFromStorage();

    effect(() => {
      const ids = this.favoriteIdsSignal();
      this.saveFavoritesToStorage(ids);
    });
  }

  // ─── Data loading ────────────────────────────────────────────────────────────
  private loadSpots(): void {
    this.http.get<Spot[]>('assets/data/spots.json').subscribe(spots => {
      const parsed = spots.map(s => ({
        ...s,
        conditions: {
          ...s.conditions,
          lastUpdated: new Date(s.conditions.lastUpdated),
        },
      }));
      this.spotsSignal.set(parsed);
      this.loadRealtimeConditions(parsed);
    });
  }

  private loadRealtimeConditions(staticSpots: Spot[]): void {
    this.http
      .get<{ spots: ApiSpotData[] }>(`${environment.apiUrl}/api/spots`)
      .subscribe({
        next: ({ spots: apiSpots }) => {
          this.isOfflineSignal.set(false);

          // Indexar por id para merge O(1)
          const apiMap = new Map(apiSpots.map(s => [s.id, s]));

          const merged = staticSpots.map(s => {
            const api = apiMap.get(s.id);
            if (!api) return s;

            const updatedConditions: RealtimeConditions = {
              waves:      api.conditions.waves,
              waterTemp:  api.conditions.waterTemp,
              weather:    api.conditions.weather,
              visibility: api.conditions.visibility,
              wind:       api.conditions.wind,
              suitability: api.suitability,
              lastUpdated: new Date(api.lastUpdated),
            };

            // Convertir facilities {parking:bool,...} → Facility[]
            const facilitiesArray: Facility[] = [
              { type: 'parking',   name: 'Parking',          available: api.facilities.parking   },
              { type: 'showers',   name: 'Showers',          available: api.facilities.showers   },
              { type: 'restaurant',name: 'Restaurant',       available: api.facilities.restaurant },
              { type: 'lifeguard', name: 'Lifeguard',        available: api.facilities.lifeguard  },
            ];

            return {
              ...s,
              score:       api.score,
              difficulty:  api.difficulty,
              conditions:  updatedConditions,
              facilities:  facilitiesArray,
              description: api.description ?? s.description,
              entryPoint:  api.entryPoint   ?? s.entryPoint,
            } satisfies Spot;
          });

          this.spotsSignal.set(merged);
          this.saveToCache(merged);
        },
        error: () => {
          const cached = this.loadFromCache();
          if (cached) {
            this.spotsSignal.set(cached.spots);
            this.cacheTimestampSignal.set(cached.timestamp);
          }
          this.isOfflineSignal.set(true);
        },
      });
  }

  // ─── Offline cache ───────────────────────────────────────────────────────────
  private saveToCache(spots: Spot[]): void {
    try {
      const payload: SpotsCache = { spots, timestamp: Date.now() };
      localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
    } catch {
      // Storage quota exceeded — ignore silently
    }
  }

  private loadFromCache(): SpotsCache | null {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as SpotsCache;
    } catch {
      return null;
    }
  }

  // ─── Filters ────────────────────────────────────────────────────────────────
  setFilter(filter: SpotFilter): void {
    this.filterSignal.set(filter);
  }

  clearFilter(): void {
    this.filterSignal.set({});
  }

  private applyFilter(spots: Spot[], filter: SpotFilter): Spot[] {
    let filtered = [...spots];

    if (filter.region) {
      filtered = this.filterByRegion(filtered, filter.region);
    }
    if (filter.difficulty) {
      filtered = filtered.filter(s => s.difficulty === filter.difficulty);
    }
    if (filter.minRating !== undefined) {
      filtered = filtered.filter(s => s.rating >= filter.minRating!);
    }
    if (filter.badge) {
      filtered = filtered.filter(s => s.badge === filter.badge);
    }

    return filtered;
  }

  private filterByRegion(spots: Spot[], region: string): Spot[] {
    const ranges: Record<string, { latMin: number; latMax: number }> = {
      North: { latMin: 28.0, latMax: 28.2 },
      South: { latMin: 27.7, latMax: 28.0 },
    };
    const range = ranges[region];
    if (!range) return spots;
    return spots.filter(
      s => s.coordinates.lat >= range.latMin && s.coordinates.lat <= range.latMax,
    );
  }

  // ─── Spot accessors ──────────────────────────────────────────────────────────
  getSpotById(id: string): Spot | undefined {
    return this.spotsSignal().find(s => s.id === id);
  }

  getFeaturedSpots(): Spot[] {
    return this.spotsSignal().filter(s => s.badge !== undefined);
  }

  getTopRatedSpots(limit = 5): Spot[] {
    return [...this.spotsSignal()].sort((a, b) => b.rating - a.rating).slice(0, limit);
  }

  // ─── Favorites ───────────────────────────────────────────────────────────────
  toggleFavorite(spotId: string): void {
    const current = this.favoriteIdsSignal();
    const updated = current.includes(spotId)
      ? current.filter(id => id !== spotId)
      : [...current, spotId];
    this.favoriteIdsSignal.set(updated);
  }

  isFavorite(spotId: string): boolean {
    return this.favoriteIdsSignal().includes(spotId);
  }

  private loadFavoritesFromStorage(): void {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      this.favoriteIdsSignal.set(JSON.parse(stored));
    }
  }

  private saveFavoritesToStorage(ids: string[]): void {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
  }
}
