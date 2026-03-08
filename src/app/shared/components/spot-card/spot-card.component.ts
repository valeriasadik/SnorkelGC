import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from '@ionic/angular/standalone';
import { IonButton } from '@ionic/angular/standalone';
import { IonBadge } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  heart,
  heartOutline,
  locationOutline,
  star,
  eyeOutline,
  thermometerOutline,
  waterOutline,
  leafOutline,
  arrowForward,
} from 'ionicons/icons';

addIcons({
  heart,
  heartOutline,
  locationOutline,
  star,
  eyeOutline,
  thermometerOutline,
  waterOutline,
  leafOutline,
  arrowForward,
});

import { Spot } from '../../models';
import { TranslationService } from 'src/app/core/services/translation.service';

@Component({
  selector: 'app-spot-card',
  standalone: true,
  imports: [
    CommonModule,
    IonIcon,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonButton,
    IonBadge,
  ],
  templateUrl: './spot-card.component.html',
  styleUrls: ['./spot-card.component.scss'],
})
export class SpotCardComponent {
  ts = inject(TranslationService);

  spot = input.required<Spot>();
  isFavorite = input<boolean>(false);

  cardClick = output<string>();
  favoriteClick = output<string>();

  onCardClick(): void {
    this.cardClick.emit(this.spot().id);
  }

  onFavoriteClick(event: Event): void {
    event.stopPropagation();
    this.favoriteClick.emit(this.spot().id);
  }

  getBadgeColor(): string {
    const badge = this.spot().badge;
    if (!badge) return 'medium';

    const colors: Record<string, string> = {
      'MOST POPULAR': 'success',
      'BEST VISIBILITY': 'tertiary',
      'CALM WATERS': 'primary',
      RECOMMENDED: 'success',
    };

    return colors[badge] || 'medium';
  }
}
