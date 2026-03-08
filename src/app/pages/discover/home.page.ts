import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { SpotCardComponent } from 'src/app/shared/components/spot-card/spot-card.component';
import { MapSpotsComponent } from 'src/app/shared/components/map-spots/map-spots.component';
import { FooterNavComponent } from 'src/app/shared/components/footer-nav/footer-nav.component';
import { LangToggleComponent } from 'src/app/shared/components/lang-toggle/lang-toggle.component';
import { SpotsService } from 'src/app/data/services/spots.service';
import { FilterType, SpotFilter, ViewMode } from 'src/app/shared/models';
import { ButtonFiltersComponent } from 'src/app/shared';
import { TranslationService } from 'src/app/core/services/translation.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    SpotCardComponent,
    MapSpotsComponent,
    ButtonFiltersComponent,
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

  selectedFilter: FilterType = 'All';
  viewMode = signal<ViewMode>('list');
  showFavoritesOnly = signal(false);

  spots = computed(() => {
    const sourceSpots =
      this.selectedFilter === 'All'
        ? this.spotsService.getFeaturedSpots()
        : this.spotsService.filteredSpots();

    if (!this.showFavoritesOnly()) {
      return sourceSpots;
    }

    const favoriteIds = this.favoriteIds();
    return sourceSpots.filter((spot) => favoriteIds.includes(spot.id));
  });

  favoriteIds = this.spotsService.favoriteIds;

  ngOnInit() {
    this.applyFilter('All');
  }

  applyFilter(filter: FilterType): void {
    this.selectedFilter = filter;

    if (filter === 'All') {
      this.spotsService.clearFilter();
      return;
    }

    const spotFilter: SpotFilter = { region: filter };
    this.spotsService.setFilter(spotFilter);
  }

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

  onFavoritesToggle(showOnlyFavorites: boolean): void {
    this.showFavoritesOnly.set(showOnlyFavorites);
  }
}
