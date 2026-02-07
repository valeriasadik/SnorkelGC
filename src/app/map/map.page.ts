import { Component, inject, computed } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { MapSpotsComponent } from '../shared/components/map-spots/map-spots.component';
import { FooterNavComponent } from '../shared/components/footer-nav/footer-nav.component';
import { SpotsService } from '../data/services/spots.service';
import { Router } from '@angular/router';

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
