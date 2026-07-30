import { MetricId } from '../psi/psi.models';

export interface Threshold {
  /** Anything up to and including this value is good. */
  readonly good: number;
  /** Anything above this value is poor. */
  readonly poor: number;
  readonly unit: 'ms' | 'unitless';
}

export const THRESHOLDS: Record<MetricId, Threshold> = {
  lcp: { good: 2500, poor: 4000, unit: 'ms' },
  inp: { good: 200, poor: 500, unit: 'ms' },
  cls: { good: 0.1, poor: 0.25, unit: 'unitless' },
  fcp: { good: 1800, poor: 3000, unit: 'ms' },
  tbt: { good: 200, poor: 600, unit: 'ms' },
  si: { good: 3400, poor: 5800, unit: 'ms' },
};

export const CORE_METRICS: readonly MetricId[] = ['lcp', 'inp', 'cls'];
