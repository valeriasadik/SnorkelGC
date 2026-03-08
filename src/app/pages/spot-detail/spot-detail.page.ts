import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonButton, IonIcon, IonBadge } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBack,
  heart,
  heartOutline,
  locationOutline,
  star,
  eyeOutline,
  thermometerOutline,
  waterOutline,
  leafOutline,
  sunnyOutline,
  cloudOutline,
  rainyOutline,
  navigateOutline,
  speedometerOutline,
} from 'ionicons/icons';
import * as L from 'leaflet';
import { SpotsService } from 'src/app/data/services/spots.service';
import { Spot } from 'src/app/shared';
import { TranslationService } from 'src/app/core/services/translation.service';

addIcons({
  arrowBack,
  heart,
  heartOutline,
  locationOutline,
  star,
  eyeOutline,
  thermometerOutline,
  waterOutline,
  leafOutline,
  sunnyOutline,
  cloudOutline,
  rainyOutline,
  navigateOutline,
  speedometerOutline,
});

@Component({
  selector: 'app-spot-detail',
  standalone: true,
  imports: [CommonModule, IonContent, IonButton, IonIcon, IonBadge],
  templateUrl: 'spot-detail.page.html',
  styleUrls: ['spot-detail.page.scss'],
})
export class SpotDetailPage implements OnInit, AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private spotsService = inject(SpotsService);
  ts = inject(TranslationService);

  mapContainer = viewChild<ElementRef>('mapContainer');

  spot = signal<Spot | undefined>(undefined);
  isFavorite = computed(() => {
    const s = this.spot();
    return s ? this.spotsService.isFavorite(s.id) : false;
  });

  private map?: L.Map;

  private fishIcon = L.divIcon({
    html: '<div class="fish-marker">🐟</div>',
    className: 'custom-fish-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found = this.spotsService.getSpotById(id);
      if (found) {
        this.spot.set(found);
      } else {
        this.router.navigate(['/discover']);
      }
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 100);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  goBack(): void {
    this.router.navigate(['/discover']);
  }

  toggleFavorite(): void {
    const s = this.spot();
    if (s) {
      this.spotsService.toggleFavorite(s.id);
    }
  }

  openGoogleMaps(): void {
    const s = this.spot();
    if (!s) return;
    const { lat, lng } = s.coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  }

  getBadgeColor(): string {
    const badge = this.spot()?.badge;
    if (!badge) return 'medium';
    const colors: Record<string, string> = {
      'MOST POPULAR': 'success',
      'BEST VISIBILITY': 'tertiary',
      'CALM WATERS': 'primary',
      RECOMMENDED: 'success',
    };
    return colors[badge] || 'medium';
  }

  getDifficultyLabel(): string {
    const d = this.spot()?.difficulty;
    if (!d) return '';
    return this.ts.t().difficulty[d] || d;
  }

  getDifficultyColor(): string {
    const d = this.spot()?.difficulty;
    const colors: Record<string, string> = {
      beginner: 'success',
      intermediate: 'warning',
      advanced: 'danger',
    };
    return d ? colors[d] || 'medium' : 'medium';
  }

  getWeatherIcon(): string {
    const condition = this.spot()?.conditions.weather.condition?.toLowerCase() || '';
    if (condition.includes('rain')) return 'rainy-outline';
    if (condition.includes('cloud')) return 'cloud-outline';
    return 'sunny-outline';
  }

  private initMap(): void {
    const s = this.spot();
    const container = this.mapContainer();
    if (!s || !container) return;

    this.map = L.map(container.nativeElement, {
      center: [s.coordinates.lat, s.coordinates.lng],
      zoom: 14,
      zoomControl: false,
      dragging: true,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 18,
    }).addTo(this.map);

    L.marker([s.coordinates.lat, s.coordinates.lng], {
      icon: this.fishIcon,
    }).addTo(this.map);
  }
}
