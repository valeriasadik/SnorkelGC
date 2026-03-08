import { Injectable, signal, computed } from '@angular/core';
import { EN, type Translations } from '../translations/en';
import { ES } from '../translations/es';

export type Lang = 'en' | 'es';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly STORAGE_KEY = 'snorkel_lang';

  private langSignal = signal<Lang>(
    (localStorage.getItem('snorkel_lang') as Lang | null) === 'es' ? 'es' : 'en',
  );

  lang = this.langSignal.asReadonly();

  t = computed<Translations>(() => (this.langSignal() === 'en' ? EN : ES));

  setLang(lang: Lang): void {
    this.langSignal.set(lang);
    localStorage.setItem(this.STORAGE_KEY, lang);
  }
}
