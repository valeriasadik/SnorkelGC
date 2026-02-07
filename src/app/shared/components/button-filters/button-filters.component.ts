import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonLabel, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { map, list } from 'ionicons/icons';

addIcons({ map, list });

export type FilterType = 'Todo' | 'Norte' | 'Sur';
export type ViewMode = 'list' | 'map';

@Component({
  selector: 'app-button-filters',
  standalone: true,
  imports: [CommonModule, IonButton, IonLabel, IonIcon],
  templateUrl: './button-filters.component.html',
  styleUrls: ['./button-filters.component.scss']
})
export class ButtonFiltersComponent {
  selectedFilter = input<FilterType>('Todo');
  viewMode = input<ViewMode>('list');

  filterChange = output<FilterType>();
  viewModeChange = output<ViewMode>();

  onFilterClick(filter: FilterType): void {
    this.filterChange.emit(filter);
  }

  toggleViewMode(): void {
    const newMode = this.viewMode() === 'list' ? 'map' : 'list';
    this.viewModeChange.emit(newMode);
  }
}
