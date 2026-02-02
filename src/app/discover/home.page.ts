import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { SpotCardComponent } from '../shared/components/spot-card/spot-card.component';
import { SpotsService } from '../data/services/spots.service';
import { SpotFilter } from '../shared/models';

type FilterType = 'Todo' | 'Norte' | 'Sur';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IonicModule, SpotCardComponent],
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  private spotsService = inject(SpotsService);
  private router = inject(Router);

  selectedFilter: FilterType = 'Todo';

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

  navigateToMap(): void {
    this.router.navigate(['/map-view']);
  }

  navigateToFavorites(): void {
    console.log('Navegar a favoritos');
  }

  navigateToSettings(): void {
    console.log('Navegar a ajustes');
  }
}
