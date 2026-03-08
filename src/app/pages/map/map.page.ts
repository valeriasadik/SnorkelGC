import { Component, inject, computed } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';

import { Router } from '@angular/router';
import { MapSpotsComponent } from 'src/app/shared/components/map-spots/map-spots.component';
import { FooterNavComponent } from 'src/app/shared/components/footer-nav/footer-nav.component';
import { SpotsService } from 'src/app/data/services/spots.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [IonContent, MapSpotsComponent, FooterNavComponent],
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage {
  private spotsService = inject(SpotsService);
  private router = inject(Router);

  spots = computed(() => this.spotsService.spots());

  onSpotClick(spotId: string): void {
    this.router.navigate(['/spot-detail', spotId]);
  }
}
