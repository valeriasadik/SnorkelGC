import { Component, inject, input, output, OnDestroy } from '@angular/core';
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
export class SearchBarComponent implements OnDestroy {
  ts = inject(TranslationService);

  value = input<string>('');
  valueChange = output<string>();

  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => this.valueChange.emit(val), 250);
  }

  clear(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.valueChange.emit('');
  }

  ngOnDestroy(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
  }
}
