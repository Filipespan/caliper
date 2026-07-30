export const en = {
  appName: 'Caliper',
  tagline: 'Core Web Vitals, side by side',
  navAudit: 'Audit',
  navCompare: 'Compare',
  navAbout: 'Thresholds',
  skipToContent: 'Skip to content',
  themeToggle: 'Switch theme',
  languageLabel: 'Language',

  urlLabel: 'Page URL',
  urlPlaceholder: 'https://example.com',
  urlInvalid: 'Enter a full URL, including https://',
  runAudit: 'Run audit',
  running: 'Running',
  cancel: 'Cancel',

  strategyMobile: 'Mobile',
  strategyDesktop: 'Desktop',
  performanceScore: 'Performance score',
  scoreAria: 'Performance on {strategy}: {score} out of 100',
  labDataNote: 'Lab data from a simulated mid-tier phone on a slow 4G connection.',

  metricLcp: 'Largest Contentful Paint',
  metricInp: 'Interaction to Next Paint',
  metricCls: 'Cumulative Layout Shift',
  metricFcp: 'First Contentful Paint',
  metricTbt: 'Total Blocking Time',
  metricSi: 'Speed Index',

  ratingGood: 'Good',
  ratingNeedsImprovement: 'Needs improvement',
  ratingPoor: 'Poor',

  recentRuns: 'Recent runs',
  recentEmptyTitle: 'No audits yet',
  recentEmptyBody: 'Run one and the last five stay here, in this browser only.',
  clearHistory: 'Clear history',
  auditFinished: 'Audit finished for {url}',

  compareTitle: 'Compare pages',
  compareIntro:
    'Add two to four URLs. They run one at a time, because the PageSpeed API rejects bursts.',
  compareAddUrl: 'Add URL',
  compareRemoveUrl: 'Remove URL',
  compareRun: 'Run comparison',
  compareBaseline: 'Baseline',
  compareQueued: 'Queued',
  compareDelta: 'Delta vs baseline',
  compareEmptyTitle: 'Nothing compared yet',
  compareEmptyBody: 'The first URL becomes the baseline, the rest are measured against it.',
  compareProgress: 'Auditing {done} of {total}',

  aboutTitle: 'What the numbers mean',
  aboutThresholds: 'Thresholds',
  aboutLabVsField: 'Lab data and field data',
  aboutColumnMetric: 'Metric',
  aboutColumnGood: 'Good',
  aboutColumnPoor: 'Poor',

  settingsTitle: 'API key',
  settingsBody:
    'The PageSpeed API works without a key at low volume. Add your own key if you hit quota limits. It stays in this browser.',
  settingsSave: 'Save key',
  settingsClear: 'Remove key',
  settingsSaved: 'Key saved in this browser',

  errorNetwork: 'The request did not reach the API. Check your connection.',
  errorRateLimited: 'The API is rate limiting this browser. Wait a minute and try again.',
  errorNotAudited: 'The API could not load that page. It may be offline or blocking crawlers.',
  errorServer: 'The API failed on its side. Trying again usually works.',
  errorUnknown: 'Something failed while auditing that URL.',
  retry: 'Try again',
};

export type Dictionary = typeof en;
export type MessageKey = keyof Dictionary;
