import { Component, inject } from '@angular/core';
import { TranslationService } from 'src/app/core/services/translation.service';

@Component({
  selector: 'app-lang-toggle',
  standalone: true,
  template: `
    <div class="lang-toggle" role="group" aria-label="Language">
      <button
        class="lang-btn"
        [class.active]="ts.lang() === 'en'"
        [attr.aria-pressed]="ts.lang() === 'en'"
        aria-label="English"
        (click)="ts.setLang('en')"
      >
        EN
      </button>
      <span class="sep" aria-hidden="true">|</span>
      <button
        class="lang-btn"
        [class.active]="ts.lang() === 'es'"
        [attr.aria-pressed]="ts.lang() === 'es'"
        aria-label="Español"
        (click)="ts.setLang('es')"
      >
        ES
      </button>
    </div>
  `,
  styles: [
    `
      .lang-toggle {
        display: flex;
        align-items: center;
        gap: 2px;
        background: rgba(0, 150, 178, 0.08);
        border: 1px solid rgba(0, 150, 178, 0.2);
        border-radius: 20px;
        padding: 3px 10px;
      }

      .lang-btn {
        background: none;
        border: none;
        padding: 2px 6px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.5px;
        color: var(--app-text-secondary, #5b7a8a);
        cursor: pointer;
        border-radius: 10px;
        transition:
          color 0.2s,
          background 0.2s;

        &.active {
          color: var(--app-primary, #0096b2);
          background: rgba(0, 150, 178, 0.1);
        }
      }

      .sep {
        font-size: 11px;
        color: var(--app-text-light, #8aaab6);
        line-height: 1;
        user-select: none;
      }
    `,
  ],
})
export class LangToggleComponent {
  ts = inject(TranslationService);
}