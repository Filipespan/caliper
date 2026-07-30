import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MetricsService } from '../../core/metrics/metrics.service';
import { CORE_METRICS, THRESHOLDS } from '../../core/metrics/thresholds';
import { I18nService } from '../../i18n/i18n.service';

const LABEL_KEYS = { lcp: 'metricLcp', inp: 'metricInp', cls: 'metricCls' } as const;
const BODY_KEYS = { lcp: 'aboutLcpBody', inp: 'aboutInpBody', cls: 'aboutClsBody' } as const;

@Component({
  selector: 'cal-about-page',
  templateUrl: './about-page.html',
  styleUrl: './about-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPageComponent {
  private readonly metrics = inject(MetricsService);
  protected readonly i18n = inject(I18nService);

  protected readonly rows = computed(() =>
    CORE_METRICS.map((id) => {
      const key = id as keyof typeof LABEL_KEYS;
      return {
        id,
        label: this.i18n.messages()[LABEL_KEYS[key]],
        body: this.i18n.messages()[BODY_KEYS[key]],
        good: this.metrics.format(id, THRESHOLDS[id].good),
        poor: this.metrics.format(id, THRESHOLDS[id].poor),
      };
    }),
  );
}
