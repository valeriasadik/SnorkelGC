import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonLabel, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { locateOutline } from 'ionicons/icons';
import { FilterType } from '../../models';
import { TranslationService } from 'src/app/core/services/translation.service';

addIcons({ locateOutline });

@Component({
  selector: 'app-button-filters',
  standalone: true,
  imports: [CommonModule, IonButton, IonLabel, IonIcon],
  templateUrl: './button-filters.component.html',
  styleUrls: ['./button-filters.component.scss'],
})
export class ButtonFiltersComponent {
  ts = inject(TranslationService);

  selectedFilter = input<FilterType>('All');
  locationLoading = input<boolean>(false);

  filterChange = output<FilterType>();

  onFilterClick(filter: FilterType): void {
    this.filterChange.emit(filter);
  }
}
