import { TestBed } from '@angular/core/testing';
import { MetricsService } from './metrics.service';

describe('MetricsService', () => {
  let metrics: MetricsService;

  beforeEach(() => {
    metrics = TestBed.inject(MetricsService);
  });

  describe('rate', () => {
    it('treats the good threshold itself as good', () => {
      expect(metrics.rate('lcp', 2500)).toBe('good');
      expect(metrics.rate('inp', 200)).toBe('good');
      expect(metrics.rate('cls', 0.1)).toBe('good');
    });

    it('treats the poor threshold itself as needs improvement', () => {
      expect(metrics.rate('lcp', 4000)).toBe('needs-improvement');
      expect(metrics.rate('inp', 500)).toBe('needs-improvement');
      expect(metrics.rate('cls', 0.25)).toBe('needs-improvement');
    });

    it('only calls a metric poor past the upper threshold', () => {
      expect(metrics.rate('lcp', 4000.1)).toBe('poor');
      expect(metrics.rate('inp', 501)).toBe('poor');
      expect(metrics.rate('cls', 0.26)).toBe('poor');
    });

    it('rates the supporting lab metrics too', () => {
      expect(metrics.rate('fcp', 1800)).toBe('good');
      expect(metrics.rate('tbt', 601)).toBe('poor');
      expect(metrics.rate('si', 4000)).toBe('needs-improvement');
    });
  });

  describe('format', () => {
    it('switches from milliseconds to seconds at one second', () => {
      expect(metrics.format('lcp', 999)).toBe('999 ms');
      expect(metrics.format('lcp', 1000)).toBe('1.0 s');
      expect(metrics.format('lcp', 2480)).toBe('2.5 s');
    });

    it('keeps layout shift unitless and free of padding zeros', () => {
      expect(metrics.format('cls', 0.08)).toBe('0.08');
      expect(metrics.format('cls', 0.1)).toBe('0.1');
      expect(metrics.format('cls', 0)).toBe('0');
    });
  });

  describe('delta', () => {
    it('signs the difference from the point of view of the baseline', () => {
      expect(metrics.delta('lcp', 2000, 3200)).toBe('+1.2 s');
      expect(metrics.delta('lcp', 3200, 2000)).toBe('-1.2 s');
      expect(metrics.delta('cls', 0.1, 0.02)).toBe('-0.08');
    });
  });
});
