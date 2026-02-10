import { Component, input, output } from '@angular/core';
import {
  IonFooter,
  IonToolbar,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { map, list, heart, heartOutline } from 'ionicons/icons';

addIcons({ map, list, heart, heartOutline });

export type ViewMode = 'list' | 'map';

@Component({
  selector: 'app-footer-nav',
  standalone: true,
  imports: [IonFooter, IonToolbar, IonButton, IonIcon],
  templateUrl: './footer-nav.component.html',
  styleUrls: ['./footer-nav.component.scss'],
})
export class FooterNavComponent {
  viewMode = input<ViewMode>('list');
  viewModeChange = output<ViewMode>();
  showFavoritesOnly = input<boolean>(false);
  showFavoritesOnlyChange = output<boolean>();

  toggleViewMode(): void {
    const newMode = this.viewMode() === 'list' ? 'map' : 'list';
    this.viewModeChange.emit(newMode);
  }

  toggleFavorites(): void {
    this.showFavoritesOnlyChange.emit(!this.showFavoritesOnly());
  }
}
