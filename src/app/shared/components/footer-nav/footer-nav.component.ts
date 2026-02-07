import { Component, input, output } from '@angular/core';
import {
  IonFooter,
  IonToolbar,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { map, list, heart } from 'ionicons/icons';

addIcons({ map, list, heart });

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

  toggleViewMode(): void {
    const newMode = this.viewMode() === 'list' ? 'map' : 'list';
    this.viewModeChange.emit(newMode);
  }

  navigateToFavorites(): void {
    console.log('Navegar a favoritos');
  }
}
