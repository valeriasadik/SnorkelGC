import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { fishOutline, chevronBack, chevronForward } from 'ionicons/icons';
import { SpotCardComponent } from 'src/app/shared/components/spot-card/spot-card.component';
import { MapSpotsComponent } from 'src/app/shared/components/map-spots/map-spots.component';
import { FooterNavComponent } from 'src/app/shared/components/footer-nav/footer-nav.component';
import { LangToggleComponent } from 'src/app/shared/components/lang-toggle/lang-toggle.component';
import { SpotsService } from 'src/app/data/services/spots.service';
import { FilterType, Spot, SpotFilter, ViewMode } from 'src/app/shared/models';
import { ButtonFiltersComponent, SearchBarComponent } from 'src/app/shared';
import { TranslationService } from 'src/app/core/services/translation.service';

addIcons({ fishOutline, chevronBack, chevronForward });

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

  readonly SPOTS_PER_PAGE = 5;

  favoriteIds = this.spotsService.favoriteIds;

  // ─── Filtered list (all pages) ──────────────────────────────────────────────
  allFilteredSpots = computed<Spot[]>(() => {
    const filter = this.selectedFilter();
    const query = this.searchQuery().trim().toLowerCase();

    let result: Spot[];

    // Near Me: sort all spots by distance from user
    if (filter === 'Near Me') {
      const loc = this.userLocation();
      if (!loc) return [];
      result = this.sortByDistance(this.spotsService.spots(), loc);
    } else {
      // Region filter: use service filteredSpots (already reacts to filterSignal)
      const sourceSpots = this.spotsService.filteredSpots();
      result = this.showFavoritesOnly()
        ? sourceSpots.filter((s) => this.favoriteIds().includes(s.id))
        : sourceSpots;
    }

    if (query) {
      result = result.filter((s) => s.name.toLowerCase().includes(query));
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

  // ─── Section header ─────────────────────────────────────────────────────────
  sectionTitle = computed(() => {
    const t = this.ts.t();
    return this.selectedFilter() === 'Near Me' ? t.discover.nearYou : t.discover.allSpots;
  });

  // ─── Lifecycle ──────────────────────────────────────────────────────────────
  ngOnInit() {
    this.applyFilter('All');
  }

  // ─── Filter logic ───────────────────────────────────────────────────────────
  applyFilter(filter: FilterType): void {
    this.selectedFilter.set(filter);
    this.currentPage.set(1);

    if (filter === 'Near Me') {
      this.fetchUserLocation();
      return;
    }

    // Clear near me state when switching away
    this.userLocation.set(null);
    this.locationError.set(null);

    if (filter === 'All') {
      this.spotsService.clearFilter();
      return;
    }

    this.spotsService.setFilter({ region: filter as SpotFilter['region'] });
  }

  // ─── Geolocation ────────────────────────────────────────────────────────────
  private fetchUserLocation(): void {
    if (!navigator.geolocation) {
      this.locationError.set('not_supported');
      this.selectedFilter.set('All');
      this.spotsService.clearFilter();
      return;
    }

    this.locationLoading.set(true);
    this.locationError.set(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.userLocation.set({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        this.locationLoading.set(false);
      },
      () => {
        this.locationError.set('denied');
        this.locationLoading.set(false);
        this.selectedFilter.set('All');
        this.spotsService.clearFilter();
      },
      { timeout: 8000, maximumAge: 60_000 },
    );
  }

  // ─── Distance helpers ────────────────────────────────────────────────────────
  private sortByDistance(
    spots: Spot[],
    from: { lat: number; lng: number },
  ): Spot[] {
    return [...spots]
      .map((spot) => ({
        spot,
        km: this.haversine(from.lat, from.lng, spot.coordinates.lat, spot.coordinates.lng),
      }))
      .sort((a, b) => a.km - b.km)
      .map(({ spot }) => spot);
  }

  private haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
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

  // ─── Pagination actions ──────────────────────────────────────────────────────
  prevPage(): void {
    if (this.currentPage() > 1) this.currentPage.update((p) => p - 1);
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) this.currentPage.update((p) => p + 1);
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
  }

  // ─── Spot actions ────────────────────────────────────────────────────────────
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
