import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { catchError, debounceTime, distinctUntilChanged, map, of, startWith, Subject, switchMap, tap } from 'rxjs';
import { HistoryService } from '../../core/history/history.service';
import { AuditError } from '../../core/psi/audit-error';
import { AuditPair } from '../../core/psi/psi.models';
import { PsiService } from '../../core/psi/psi.service';
import { urlValidator } from '../../core/validation/url-validator';
import { I18nService } from '../../i18n/i18n.service';
import { EmptyStateComponent } from '../../ui/empty-state/empty-state';
import { AuditSummaryComponent } from './audit-summary/audit-summary';

type AuditState =
  | { readonly status: 'idle' }
  | { readonly status: 'loading'; readonly url: string }
  | { readonly status: 'done'; readonly pair: AuditPair }
  | { readonly status: 'error'; readonly error: AuditError };

@Component({
  selector: 'cal-audit-page',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AuditSummaryComponent,
    EmptyStateComponent,
  ],
  templateUrl: './audit-page.html',
  styleUrl: './audit-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditPageComponent {
  private readonly psi = inject(PsiService);
  private readonly announcer = inject(LiveAnnouncer);

  protected readonly history = inject(HistoryService);
  protected readonly i18n = inject(I18nService);

  protected readonly url = new FormControl('', { nonNullable: true, validators: [urlValidator] });

  private readonly submissions = new Subject<string>();

  /** Typing is noisy, so the error message waits for a pause instead of
      flashing after every keystroke. */
  protected readonly urlInvalid = toSignal(
    this.url.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      map((value) => value.trim() !== '' && this.url.invalid),
    ),
    { initialValue: false },
  );

  protected readonly state = toSignal(
    this.submissions.pipe(
      // switchMap, not mergeMap: a second submission replaces the first one, and
      // keeping the abandoned run alive would race to paint stale scores.
      switchMap((url) =>
        this.psi.auditBoth(url).pipe(
          tap((pair) => {
            this.history.record(pair);
            this.announcer.announce(this.i18n.format('auditFinished', { url: pair.url }));
          }),
          map((pair): AuditState => ({ status: 'done', pair })),
          catchError((error: AuditError) => of<AuditState>({ status: 'error', error })),
          startWith<AuditState>({ status: 'loading', url }),
        ),
      ),
    ),
    { initialValue: { status: 'idle' } as AuditState },
  );

  protected readonly loading = computed(() => this.state().status === 'loading');

  protected readonly failure = computed(() => {
    const state = this.state();
    return state.status === 'error' ? state.error : null;
  });

  protected readonly pair = computed(() => {
    const state = this.state();
    return state.status === 'done' ? state.pair : null;
  });

  protected submit(event?: Event): void {
    // Native submit, not ngSubmit: there is no NgForm here, only a lone control.
    event?.preventDefault();
    const value = this.url.value.trim();
    if (value === '' || this.url.invalid) {
      this.url.markAsTouched();
      return;
    }
    this.submissions.next(value);
  }

  protected rerun(url: string): void {
    this.url.setValue(url);
    this.submissions.next(url);
  }
}
