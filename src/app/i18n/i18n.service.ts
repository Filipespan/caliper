import { computed, Injectable, signal } from '@angular/core';
import { Dictionary, en, MessageKey } from './en';
import { ptBR } from './pt-BR';

export const LOCALES = ['en', 'pt-BR'] as const;
export type Locale = (typeof LOCALES)[number];

const DICTIONARIES: Record<Locale, Dictionary> = { en, 'pt-BR': ptBR };
const STORAGE_KEY = 'caliper.locale';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly current = signal<Locale>(readInitialLocale());

  readonly locale = this.current.asReadonly();
  readonly messages = computed(() => DICTIONARIES[this.current()]);
  readonly locales = LOCALES;

  constructor() {
    this.applyDocumentLang(this.current());
  }

  setLocale(locale: Locale): void {
    this.current.set(locale);
    this.applyDocumentLang(locale);
    localStorage.setItem(STORAGE_KEY, locale);
  }

  /** Fills `{name}` placeholders. Used for the few strings that carry values. */
  format(key: MessageKey, values: Record<string, string | number>): string {
    return this.messages()[key].replace(/\{(\w+)\}/g, (match, name: string) =>
      name in values ? String(values[name]) : match,
    );
  }

  private applyDocumentLang(locale: Locale): void {
    document.documentElement.lang = locale;
  }
}

function readInitialLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (isLocale(stored)) {
    return stored;
  }
  return navigator.language.toLowerCase().startsWith('pt') ? 'pt-BR' : 'en';
}

function isLocale(value: string | null): value is Locale {
  return value !== null && (LOCALES as readonly string[]).includes(value);
}
