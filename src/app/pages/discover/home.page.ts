import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { fishOutline, chevronBack, chevronForward, wifiOutline, locateOutline } from 'ionicons/icons';
import { SpotCardComponent } from 'src/app/shared/components/spot-card/spot-card.component';
import { MapSpotsComponent } from 'src/app/shared/components/map-spots/map-spots.component';
import { FooterNavComponent } from 'src/app/shared/components/footer-nav/footer-nav.component';
import { LangToggleComponent } from 'src/app/shared/components/lang-toggle/lang-toggle.component';
import { SpotsService } from 'src/app/data/services/spots.service';
import { FilterType, Spot, SpotFilter, ViewMode } from 'src/app/shared/models';
import { ButtonFiltersComponent, SearchBarComponent } from 'src/app/shared';
import { TranslationService } from 'src/app/core/services/translation.service';

addIcons({ fishOutline, chevronBack, chevronForward, wifiOutline, locateOutline });

const GEO_MAX_AGE_MS = 15 * 60 * 1000; // 15 minutes

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    SpotCardComponent,
    MapSpotsComponent,
    ButtonFiltersComponent,
    SearchBarComponent,
    FooterNavComponent,
    LangToggleComponent,
    IonContent,
    IonIcon,
  ],
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  private spotsService = inject(SpotsService);
  private router = inject(Router);
  ts = inject(TranslationService);

  // ─── State signals ──────────────────────────────────────────────────────────
  selectedFilter = signal<FilterType>('All');
  viewMode = signal<ViewMode>('list');
  showFavoritesOnly = signal(false);
  userLocation = signal<{ lat: number; lng: number } | null>(null);
  locationLoading = signal(false);
  locationError = signal<string | null>(null);
  currentPage = signal(1);
  searchQuery = signal('');

  /** Timestamp of when the geo position was obtained (for 15-min cache) */
  private geoTimestamp = 0;

  readonly SPOTS_PER_PAGE = 5;

  favoriteIds = this.spotsService.favoriteIds;
  isOffline = this.spotsService.isOffline;
  cacheAgeHours = this.spotsService.cacheAgeHours;

  // ─── Distance map (spotId → km) ─────────────────────────────────────────────
  distancesMap = computed<Record<string, number>>(() => {
    const loc = this.userLocation();
    if (!loc) return {};
    const map: Record<string, number> = {};
    for (const spot of this.spotsService.spots()) {
      map[spot.id] = haversineKm(loc.lat, loc.lng, spot.coordinates.lat, spot.coordinates.lng);
    }
    return map;
  });

  // ─── Filtered + sorted list (all pages) ────────────────────────────────────
  allFilteredSpots = computed<Spot[]>(() => {
    const filter = this.selectedFilter();
    const query = this.searchQuery().trim().toLowerCase();
    const loc = this.userLocation();

    let result: Spot[];

    if (filter === 'Near Me') {
      // Pure distance sort when "Near Me" is active
      const base = this.spotsService.spots();
      if (!loc) return [];
      result = sortByDistance(base, loc);
    } else {
      const sourceSpots = this.spotsService.filteredSpots();
      result = this.showFavoritesOnly()
        ? sourceSpots.filter(s => this.favoriteIds().includes(s.id))
        : sourceSpots;
    }

    if (query) {
      result = result.filter(s => s.name.toLowerCase().includes(query));
    }

    // Default sort: score*0.7 + proximity*0.3 (if location) else score only
    if (filter !== 'Near Me') {
      if (loc) {
        result = [...result].sort((a, b) => {
          const dA = haversineKm(loc.lat, loc.lng, a.coordinates.lat, a.coordinates.lng);
          const dB = haversineKm(loc.lat, loc.lng, b.coordinates.lat, b.coordinates.lng);
          return sortValue(b, dB) - sortValue(a, dA);
        });
      } else {
        result = [...result].sort((a, b) => effectiveScore(b) - effectiveScore(a));
      }
    }

    return result;
  });

  // ─── Pagination ─────────────────────────────────────────────────────────────
  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.allFilteredSpots().length / this.SPOTS_PER_PAGE)),
  );

  spots = computed(() => {
    const page = this.currentPage();
    const all = this.allFilteredSpots();
    const start = (page - 1) * this.SPOTS_PER_PAGE;
    return all.slice(start, start + this.SPOTS_PER_PAGE);
  });

  pagesArray = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1),
  );

  // ─── Section header ──────────────────────────────────────────────────────────
  sectionTitle = computed(() => {
    const t = this.ts.t();
    if (this.selectedFilter() === 'Near Me') return t.discover.nearYou;
    return t.discover.allSpots;
  });

  sortBanner = computed(() => {
    const t = this.ts.t();
    if (this.selectedFilter() === 'Near Me' && this.userLocation()) {
      return t.discover.sortedByDistance;
    }
    if (this.userLocation()) return t.discover.sortedByDistance;
    return t.discover.sortedByScore;
  });

  offlineBanner = computed(() => {
    const t = this.ts.t();
    const hours = this.cacheAgeHours();
    if (!this.isOffline()) return null;
    if (hours !== null) {
      return t.discover.cachedData.replace('{hours}', String(hours));
    }
    return t.discover.offlineMode;
  });

  // ─── Lifecycle ───────────────────────────────────────────────────────────────
  ngOnInit() {
    this.applyFilter('All');
    this.requestGeoSilently();
  }

  // ─── Geo ─────────────────────────────────────────────────────────────────────
  /**
   * Silently request geolocation on app open.
   * Uses a 15-minute in-memory cache so we don't spam the GPS.
   */
  private requestGeoSilently(): void {
    if (!navigator.geolocation) return;

    // Already have a fresh fix
    if (this.userLocation() && Date.now() - this.geoTimestamp < GEO_MAX_AGE_MS) return;

    navigator.geolocation.getCurrentPosition(
      pos => {
        this.geoTimestamp = Date.now();
        this.userLocation.set({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        this.locationError.set(null);
      },
      () => {
        /* permission denied — sort by score only, no error banner needed */
      },
      { timeout: 8000, maximumAge: GEO_MAX_AGE_MS },
    );
  }

  // ─── Filter logic ─────────────────────────────────────────────────────────────
  applyFilter(filter: FilterType): void {
    this.selectedFilter.set(filter);
    this.currentPage.set(1);

    if (filter === 'Near Me') {
      this.fetchUserLocationExplicit();
      return;
    }

    this.locationError.set(null);

    if (filter === 'All') {
      this.spotsService.clearFilter();
      return;
    }

    this.spotsService.setFilter({ region: filter as SpotFilter['region'] });
  }

  /** Explicit "Near Me" button tap — shows loading feedback */
  private fetchUserLocationExplicit(): void {
    if (!navigator.geolocation) {
      this.locationError.set('not_supported');
      this.selectedFilter.set('All');
      this.spotsService.clearFilter();
      return;
    }

    // Use cached fix if fresh
    if (this.userLocation() && Date.now() - this.geoTimestamp < GEO_MAX_AGE_MS) return;

    this.locationLoading.set(true);
    this.locationError.set(null);

    navigator.geolocation.getCurrentPosition(
      pos => {
        this.geoTimestamp = Date.now();
        this.userLocation.set({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        this.locationLoading.set(false);
      },
      () => {
        this.locationError.set('denied');
        this.locationLoading.set(false);
        this.selectedFilter.set('All');
        this.spotsService.clearFilter();
      },
      { timeout: 8000, maximumAge: GEO_MAX_AGE_MS },
    );
  }

  // ─── Pagination ───────────────────────────────────────────────────────────────
  prevPage(): void {
    if (this.currentPage() > 1) this.currentPage.update(p => p - 1);
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) this.currentPage.update(p => p + 1);
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
  }

  // ─── Spot actions ─────────────────────────────────────────────────────────────
  onSpotClick(spotId: string): void {
    this.router.navigate(['/spot-detail', spotId]);
  }

  onFavoriteClick(spotId: string): void {
    this.spotsService.toggleFavorite(spotId);
  }

  isFavorite(spotId: string): boolean {
    return this.spotsService.isFavorite(spotId);
  }

  onViewModeChange(mode: ViewMode): void {
    this.viewMode.set(mode);
  }

  onFavoritesToggle(showOnly: boolean): void {
    this.showFavoritesOnly.set(showOnly);
    this.currentPage.set(1);
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1);
  }
}

// ─── Pure helpers (module-level) ──────────────────────────────────────────────
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function effectiveScore(spot: Spot): number {
  if (spot.score !== undefined) return spot.score;
  const map: Record<string, number> = { Excellent: 9, Good: 7, Fair: 5, Poor: 3 };
  return map[spot.conditions.suitability] ?? 5;
}

function sortValue(spot: Spot, distanceKm: number): number {
  const sc = effectiveScore(spot);
  const proximityBonus = 10 - Math.min(distanceKm, 50) / 5;
  return sc * 0.7 + proximityBonus * 0.3;
}

function sortByDistance(spots: Spot[], from: { lat: number; lng: number }): Spot[] {
  return [...spots]
    .map(spot => ({
      spot,
      km: haversineKm(from.lat, from.lng, spot.coordinates.lat, spot.coordinates.lng),
    }))
    .sort((a, b) => a.km - b.km)
    .map(({ spot }) => spot);
}
