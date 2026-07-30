import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SettingsService } from './core/settings/settings.service';
import { I18nService, Locale } from './i18n/i18n.service';

@Component({
  selector: 'cal-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule,
    MatToolbarModule,
    MatTabsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly snackBar = inject(MatSnackBar);

  protected readonly settings = inject(SettingsService);
  protected readonly i18n = inject(I18nService);

  protected readonly apiKey = new FormControl(this.settings.apiKey() ?? '', { nonNullable: true });

  protected readonly links = [
    { path: '/', labelKey: 'navAudit' },
    { path: '/compare', labelKey: 'navCompare' },
    { path: '/about', labelKey: 'navAbout' },
  ] as const;

  protected readonly darkActive = computed(() => this.settings.theme() === 'dark');

  protected toggleTheme(): void {
    this.settings.setTheme(this.darkActive() ? 'light' : 'dark');
  }

  protected changeLocale(value: string): void {
    this.i18n.setLocale(value as Locale);
  }

  protected saveKey(): void {
    this.settings.setApiKey(this.apiKey.value);
    this.snackBar.open(this.i18n.messages().settingsSaved, undefined, { duration: 3000 });
  }

  protected clearKey(): void {
    this.settings.clearApiKey();
    this.apiKey.setValue('');
  }
}
