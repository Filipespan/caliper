import { Injectable, signal } from '@angular/core';

export type ThemeChoice = 'system' | 'light' | 'dark';

const KEY_API = 'caliper.apiKey';
const KEY_THEME = 'caliper.theme';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly key = signal<string | null>(localStorage.getItem(KEY_API));
  private readonly themeChoice = signal<ThemeChoice>(readTheme());

  readonly apiKey = this.key.asReadonly();
  readonly theme = this.themeChoice.asReadonly();

  constructor() {
    this.applyTheme(this.themeChoice());
  }

  setApiKey(value: string): void {
    const trimmed = value.trim();
    if (trimmed === '') {
      this.clearApiKey();
      return;
    }
    this.key.set(trimmed);
    localStorage.setItem(KEY_API, trimmed);
  }

  clearApiKey(): void {
    this.key.set(null);
    localStorage.removeItem(KEY_API);
  }

  setTheme(choice: ThemeChoice): void {
    this.themeChoice.set(choice);
    localStorage.setItem(KEY_THEME, choice);
    this.applyTheme(choice);
  }

  private applyTheme(choice: ThemeChoice): void {
    const root = document.documentElement;
    if (choice === 'system') {
      root.removeAttribute('data-theme');
      return;
    }
    root.setAttribute('data-theme', choice);
  }
}

function readTheme(): ThemeChoice {
  const stored = localStorage.getItem(KEY_THEME);
  return stored === 'light' || stored === 'dark' ? stored : 'system';
}
