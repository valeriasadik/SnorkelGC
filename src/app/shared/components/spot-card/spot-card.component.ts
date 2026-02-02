import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Spot } from '../../models';

@Component({
  selector: 'app-spot-card',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './spot-card.component.html',
  styleUrls: ['./spot-card.component.scss']
})
export class SpotCardComponent {
  // Signals de entrada (Angular 18+)
  spot = input.required<Spot>();
  isFavorite = input<boolean>(false);

  // Eventos de salida
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
      'MÁS POPULAR': 'success',
      'MEJOR VISIBILIDAD': 'tertiary',
      'AGUAS CALMAS': 'primary',
      'RECOMMENDED': 'success'
    };

    return colors[badge] || 'medium';
  }
}
