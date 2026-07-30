export type Strategy = 'mobile' | 'desktop';

export type MetricId = 'lcp' | 'inp' | 'cls' | 'fcp' | 'tbt' | 'si';

export interface MetricSample {
  readonly id: MetricId;
  readonly value: number;
  readonly display: string;
  readonly source: 'lab' | 'field';
}

export interface AuditResult {
  readonly url: string;
  readonly finalUrl: string;
  readonly strategy: Strategy;
  readonly score: number | null;
  readonly metrics: readonly MetricSample[];
  readonly fetchedAt: number;
}

export interface AuditPair {
  readonly url: string;
  readonly mobile: AuditResult;
  readonly desktop: AuditResult;
}

/** Only the slice of the PageSpeed payload this app reads. */
export interface PsiResponse {
  readonly id?: string;
  readonly lighthouseResult?: {
    readonly finalUrl?: string;
    readonly categories?: {
      readonly performance?: { readonly score?: number | null };
    };
    readonly audits?: Record<string, PsiAudit | undefined>;
  };
  readonly loadingExperience?: {
    readonly metrics?: Record<string, PsiFieldMetric | undefined>;
  };
}

export interface PsiAudit {
  readonly numericValue?: number;
  readonly displayValue?: string;
}

export interface PsiFieldMetric {
  readonly percentile?: number;
}
