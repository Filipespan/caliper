import { Injectable } from '@angular/core';
import { Rating } from '../../ui/rating';
import { MetricId } from '../psi/psi.models';
import { THRESHOLDS } from './thresholds';

@Injectable({ providedIn: 'root' })
export class MetricsService {
  rate(id: MetricId, value: number): Rating {
    const { good, poor } = THRESHOLDS[id];
    if (value <= good) {
      return 'good';
    }
    return value <= poor ? 'needs-improvement' : 'poor';
  }

  format(id: MetricId, value: number): string {
    if (THRESHOLDS[id].unit === 'unitless') {
      return trimZeros(value);
    }
    return value >= 1000 ? `${(value / 1000).toFixed(1)} s` : `${Math.round(value)} ms`;
  }

  /** Positive means the candidate got worse than the baseline. */
  delta(id: MetricId, baseline: number, candidate: number): string {
    const diff = candidate - baseline;
    const sign = diff > 0 ? '+' : '';
    if (THRESHOLDS[id].unit === 'unitless') {
      return `${sign}${trimZeros(diff)}`;
    }
    return Math.abs(diff) >= 1000
      ? `${sign}${(diff / 1000).toFixed(1)} s`
      : `${sign}${Math.round(diff)} ms`;
  }
}

function trimZeros(value: number): string {
  return String(Number(value.toFixed(3)));
}
