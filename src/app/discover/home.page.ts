import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';
import { SpotCardComponent } from '../shared/components/spot-card/spot-card.component';
import { MapSpotsComponent } from '../shared/components/map-spots/map-spots.component';
import { FooterNavComponent } from '../shared/components/footer-nav/footer-nav.component';
import {
  ButtonFiltersComponent,
  FilterType,
  ViewMode,
} from '../shared/components/button-filters/button-filters.component';
import { SpotsService } from '../data/services/spots.service';
import { SpotFilter } from '../shared/models';
import { IonContent, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    SpotCardComponent,
    MapSpotsComponent,
    ButtonFiltersComponent,
    FooterNavComponent,
    IonContent,
    IonIcon,
  ],
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  private spotsService = inject(SpotsService);
  private router = inject(Router);

  selectedFilter: FilterType = 'Todo';
  viewMode = signal<ViewMode>('list');

  // Computed signals
  spots = computed(() => {
    if (this.selectedFilter === 'Todo') {
      return this.spotsService.getFeaturedSpots();
    }
    return this.spotsService.filteredSpots();
  });

  favoriteIds = this.spotsService.favoriteIds;

  ngOnInit() {
    this.applyFilter('Todo');
  }

  applyFilter(filter: FilterType): void {
    this.selectedFilter = filter;

    if (filter === 'Todo') {
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
    console.log('View mode changed to:', mode);
  }
}
