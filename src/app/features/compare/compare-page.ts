import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject, switchMap } from 'rxjs';
import { MetricsService } from '../../core/metrics/metrics.service';
import { CORE_METRICS } from '../../core/metrics/thresholds';
import { MetricId } from '../../core/psi/psi.models';
import { urlValidator } from '../../core/validation/url-validator';
import { I18nService } from '../../i18n/i18n.service';
import { EmptyStateComponent } from '../../ui/empty-state/empty-state';
import { StatusPillComponent } from '../../ui/status-pill/status-pill';
import { CompareProgress, CompareQueueService } from './compare-queue.service';

const MIN_URLS = 2;
const MAX_URLS = 4;

const METRIC_LABEL_KEYS = {
  lcp: 'metricLcp',
  inp: 'metricInp',
  cls: 'metricCls',
  fcp: 'metricFcp',
  tbt: 'metricTbt',
  si: 'metricSi',
} as const;

@Component({
  selector: 'cal-compare-page',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    StatusPillComponent,
    EmptyStateComponent,
  ],
  templateUrl: './compare-page.html',
  styleUrl: './compare-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComparePageComponent {
  private readonly queue = inject(CompareQueueService);
  private readonly metrics = inject(MetricsService);

  protected readonly i18n = inject(I18nService);
  protected readonly maxUrls = MAX_URLS;

  protected readonly urls = new FormArray([newUrlControl(), newUrlControl()]);

  private readonly runs = new Subject<string[]>();

  protected readonly progress = toSignal(
    this.runs.pipe(switchMap((urls) => this.queue.run(urls))),
    { initialValue: { rows: [], total: 0, finished: false } as CompareProgress },
  );

  protected readonly running = computed(() => {
    const progress = this.progress();
    return progress.total > 0 && !progress.finished;
  });

  protected readonly table = computed(() => {
    const rows = this.progress().rows.flatMap((row) =>
      row.result === null ? [] : [{ url: row.url, result: row.result }],
    );
    const baseline = rows[0];
    if (baseline === undefined) {
      return [];
    }

    return rows.map(({ url, result }, index) => ({
      url,
      score: result.score,
      isBaseline: index === 0,
      cells: CORE_METRICS.map((id) =>
        this.cell(id, result.metrics, baseline.result.metrics, index === 0),
      ),
    }));
  });

  protected addUrl(): void {
    if (this.urls.length < MAX_URLS) {
      this.urls.push(newUrlControl());
    }
  }

  protected removeUrl(index: number): void {
    if (this.urls.length > MIN_URLS) {
      this.urls.removeAt(index);
    }
  }

  protected run(event?: Event): void {
    event?.preventDefault();
    const values = this.urls.controls.map((control) => control.value.trim()).filter((v) => v !== '');
    if (values.length < MIN_URLS || this.urls.invalid) {
      this.urls.markAllAsTouched();
      return;
    }
    this.runs.next(values);
  }

  private cell(
    id: MetricId,
    metrics: readonly { id: MetricId; value: number }[],
    baseline: readonly { id: MetricId; value: number }[],
    isBaseline: boolean,
  ) {
    const sample = metrics.find((metric) => metric.id === id);
    const reference = baseline.find((metric) => metric.id === id);
    if (sample === undefined) {
      return { id, label: this.label(id), display: '--', delta: null, rating: 'poor' as const };
    }
    return {
      id,
      label: this.label(id),
      display: this.metrics.format(id, sample.value),
      delta:
        isBaseline || reference === undefined
          ? null
          : this.metrics.delta(id, reference.value, sample.value),
      rating: this.metrics.rate(id, sample.value),
    };
  }

  private label(id: MetricId): string {
    return this.i18n.messages()[METRIC_LABEL_KEYS[id]];
  }
}

function newUrlControl(): FormControl<string> {
  return new FormControl('', { nonNullable: true, validators: [urlValidator] });
}
