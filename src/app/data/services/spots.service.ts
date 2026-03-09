import { Injectable, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Spot, SpotFilter, RealtimeConditions } from '../../shared/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SpotsService {
  // State con Signals
  private spotsSignal = signal<Spot[]>([]);
  private favoriteIdsSignal = signal<string[]>([]);
  private filterSignal = signal<SpotFilter>({});

  // Computed signals (auto-calculados)
  spots = computed(() => this.spotsSignal());
  favoriteIds = computed(() => this.favoriteIdsSignal());

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

    // Auto-guardar favoritos cuando cambien
    effect(() => {
      const ids = this.favoriteIdsSignal();
      this.saveFavoritesToStorage(ids);
    });
  }

  // CARGA DE DATOS
  private loadSpots(): void {
    this.http.get<Spot[]>('assets/data/spots.json').subscribe(spots => {
      const parsedSpots = spots.map(spot => ({
        ...spot,
        conditions: {
          ...spot.conditions,
          lastUpdated: new Date(spot.conditions.lastUpdated),
        },
      }));
      this.spotsSignal.set(parsedSpots);
      this.loadRealtimeConditions(parsedSpots);
    });
  }

  private loadRealtimeConditions(spots: Spot[]): void {
    spots.forEach(spot => {
      this.http.get<RealtimeConditions>(`${environment.apiUrl}/api/spot/${spot.id}`).subscribe({
        next: conditions => {
          this.spotsSignal.update(current =>
            current.map(s =>
              s.id === spot.id
                ? {
                    ...s,
                    conditions: {
                      ...conditions,
                      lastUpdated: new Date(conditions.lastUpdated as unknown as string),
                    },
                  }
                : s
            )
          );
          console.log(conditions);
        },
        error: () => {
          /* mantiene las condiciones del JSON si falla */
        },
      });
    });
  }

  // FILTROS
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
      s => s.coordinates.lat >= range.latMin && s.coordinates.lat <= range.latMax
    );
  }

  // SPOTS ESPECÍFICOS
  getSpotById(id: string): Spot | undefined {
    return this.spotsSignal().find(spot => spot.id === id);
  }

  getFeaturedSpots(): Spot[] {
    return this.spotsSignal().filter(spot => spot.badge !== undefined);
  }

  getTopRatedSpots(limit: number = 5): Spot[] {
    return [...this.spotsSignal()].sort((a, b) => b.rating - a.rating).slice(0, limit);
  }

  // FAVORITOS
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
    const stored = localStorage.getItem('snorkel_favorites');
    if (stored) {
      this.favoriteIdsSignal.set(JSON.parse(stored));
    }
  }

  private saveFavoritesToStorage(ids: string[]): void {
    localStorage.setItem('snorkel_favorites', JSON.stringify(ids));
  }
}
