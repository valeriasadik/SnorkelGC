import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-score-badge',
  standalone: true,
  templateUrl: './score-badge.component.html',
  styleUrls: ['./score-badge.component.scss'],
})
export class ScoreBadgeComponent {
  score = input.required<number>();
  label = input.required<string>();
  size = input<'card' | 'detail'>('card');

  color = computed(() => {
    const s = this.score();
    if (s >= 7) return '#22c55e';
    if (s >= 5) return '#eab308';
    return '#ef4444';
  });

  scoreFormatted = computed(() => {
    const s = this.score();
    return Number.isInteger(s) ? String(s) : s.toFixed(1);
  });
}
