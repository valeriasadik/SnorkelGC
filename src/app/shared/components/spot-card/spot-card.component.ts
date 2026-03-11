import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonBadge, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  heart,
  heartOutline,
  locationOutline,
  star,
  thermometerOutline,
  waterOutline,
  leafOutline,
  arrowForward,
} from 'ionicons/icons';
import { Spot } from '../../models';
import { TranslationService } from 'src/app/core/services/translation.service';

addIcons({ heart, heartOutline, locationOutline, star, thermometerOutline, waterOutline, leafOutline, arrowForward });

@Component({
  selector: 'app-spot-card',
  standalone: true,
  imports: [CommonModule, IonIcon, IonBadge, IonButton],
  templateUrl: './spot-card.component.html',
  styleUrls: ['./spot-card.component.scss'],
})
export class SpotCardComponent {
  ts = inject(TranslationService);

  spot = input.required<Spot>();
  isFavorite = input<boolean>(false);
  distanceKm = input<number | undefined>(undefined);

  cardClick = output<string>();
  favoriteClick = output<string>();

  onCardClick(): void { this.cardClick.emit(this.spot().id); }

  onFavoriteClick(event: Event): void {
    event.stopPropagation();
    this.favoriteClick.emit(this.spot().id);
  }

  getEffectiveScore(): number {
    const s = this.spot();
    if (s.score !== undefined) return s.score;
    const map: Record<string, number> = { Excellent: 9, Good: 7, Fair: 5, Poor: 3 };
    return map[s.conditions.suitability] ?? 5;
  }

  getScoreColor(): string {
    const sc = this.getEffectiveScore();
    if (sc >= 7) return '#22c55e';
    if (sc >= 5) return '#eab308';
    return '#ef4444';
  }

  getDifficultyColor(): string {
    const colors: Record<string, string> = { beginner: 'success', intermediate: 'warning', advanced: 'danger' };
    return colors[this.spot().difficulty] ?? 'medium';
  }

  getDifficultyLabel(): string {
    return this.ts.t().difficulty[this.spot().difficulty] ?? this.spot().difficulty;
  }

  getBadgeColor(): string {
    const badge = this.spot().badge;
    if (!badge) return 'medium';
    const colors: Record<string, string> = {
      'MOST POPULAR': 'success', 'BEST VISIBILITY': 'tertiary', 'CALM WATERS': 'primary', RECOMMENDED: 'success',
    };
    return colors[badge] ?? 'medium';
  }

  formatDistance(km: number): string {
    return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
  }
}
