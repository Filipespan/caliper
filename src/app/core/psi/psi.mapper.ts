import { AuditResult, MetricId, MetricSample, PsiResponse, Strategy } from './psi.models';

const LAB_AUDITS: Record<Exclude<MetricId, 'inp'>, string> = {
  lcp: 'largest-contentful-paint',
  cls: 'cumulative-layout-shift',
  fcp: 'first-contentful-paint',
  tbt: 'total-blocking-time',
  si: 'speed-index',
};

export function toAuditResult(url: string, strategy: Strategy, body: PsiResponse): AuditResult {
  const lighthouse = body.lighthouseResult;
  const rawScore = lighthouse?.categories?.performance?.score;
  const metrics: MetricSample[] = [];

  for (const [id, auditId] of Object.entries(LAB_AUDITS) as [MetricId, string][]) {
    const audit = lighthouse?.audits?.[auditId];
    if (audit?.numericValue === undefined) {
      continue;
    }
    metrics.push({
      id,
      value: audit.numericValue,
      display: audit.displayValue ?? String(audit.numericValue),
      source: 'lab',
    });
  }

  // INP has no lab equivalent, so it only shows up for pages with enough CrUX traffic.
  const inp = body.loadingExperience?.metrics?.['INTERACTION_TO_NEXT_PAINT']?.percentile;
  if (inp !== undefined) {
    metrics.push({ id: 'inp', value: inp, display: `${inp} ms`, source: 'field' });
  }

  return {
    url,
    finalUrl: lighthouse?.finalUrl ?? url,
    strategy,
    score: typeof rawScore === 'number' ? Math.round(rawScore * 100) : null,
    metrics,
    fetchedAt: Date.now(),
  };
}
