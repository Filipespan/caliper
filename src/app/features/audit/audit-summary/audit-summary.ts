import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MetricsService } from '../../../core/metrics/metrics.service';
import { THRESHOLDS } from '../../../core/metrics/thresholds';
import { AuditResult, MetricId } from '../../../core/psi/psi.models';
import { I18nService } from '../../../i18n/i18n.service';
import { MetricBarComponent } from '../../../ui/metric-bar/metric-bar';
import { ScoreGaugeComponent } from '../../../ui/score-gauge/score-gauge';
import { StatusPillComponent } from '../../../ui/status-pill/status-pill';

const METRIC_LABELS: Record<MetricId, 'metricLcp' | 'metricInp' | 'metricCls' | 'metricFcp' | 'metricTbt' | 'metricSi'> =
  {
    lcp: 'metricLcp',
    inp: 'metricInp',
    cls: 'metricCls',
    fcp: 'metricFcp',
    tbt: 'metricTbt',
    si: 'metricSi',
  };

@Component({
  selector: 'cal-audit-summary',
  imports: [ScoreGaugeComponent, MetricBarComponent, StatusPillComponent],
  templateUrl: './audit-summary.html',
  styleUrl: './audit-summary.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditSummaryComponent {
  readonly result = input.required<AuditResult>();

  private readonly metrics = inject(MetricsService);
  protected readonly i18n = inject(I18nService);

  protected readonly strategyLabel = computed(() =>
    this.result().strategy === 'mobile'
      ? this.i18n.messages().strategyMobile
      : this.i18n.messages().strategyDesktop,
  );

  protected readonly gaugeAria = computed(() =>
    this.i18n.format('scoreAria', {
      strategy: this.strategyLabel(),
      score: this.result().score ?? 0,
    }),
  );

  protected readonly rows = computed(() =>
    this.result().metrics.map((metric) => {
      const rating = this.metrics.rate(metric.id, metric.value);
      return {
        id: metric.id,
        label: this.i18n.messages()[METRIC_LABELS[metric.id]],
        display: this.metrics.format(metric.id, metric.value),
        value: metric.value,
        rating,
        ratingLabel: this.ratingLabel(rating),
        goodMax: THRESHOLDS[metric.id].good,
        poorMin: THRESHOLDS[metric.id].poor,
        source: metric.source,
      };
    }),
  );

  private ratingLabel(rating: string): string {
    const messages = this.i18n.messages();
    if (rating === 'good') {
      return messages.ratingGood;
    }
    return rating === 'needs-improvement'
      ? messages.ratingNeedsImprovement
      : messages.ratingPoor;
  }
}
