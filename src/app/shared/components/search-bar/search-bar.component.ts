import { Component, inject, input, output } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline, closeCircle } from 'ionicons/icons';
import { TranslationService } from 'src/app/core/services/translation.service';

addIcons({ searchOutline, closeCircle });

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [IonIcon],
  templateUrl: 'search-bar.component.html',
  styleUrls: ['search-bar.component.scss'],
})
export class SearchBarComponent {
  ts = inject(TranslationService);

  value = input<string>('');
  valueChange = output<string>();

  onInput(event: Event): void {
    this.valueChange.emit((event.target as HTMLInputElement).value);
  }

  clear(): void {
    this.valueChange.emit('');
  }
}
