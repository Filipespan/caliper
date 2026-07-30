import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Subject, switchMap } from 'rxjs';
import { advanceClock, installFakeClock, uninstallFakeClock } from '../../../testing/spy';
import { AuditError } from './audit-error';
import { AuditResult, PsiResponse } from './psi.models';
import { PsiService } from './psi.service';

const ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

const body: PsiResponse = {
  lighthouseResult: {
    finalUrl: 'https://example.com/',
    categories: { performance: { score: 0.87 } },
    audits: {
      'largest-contentful-paint': { numericValue: 2480, displayValue: '2.5 s' },
      'cumulative-layout-shift': { numericValue: 0.04, displayValue: '0.04' },
      'total-blocking-time': { numericValue: 150, displayValue: '150 ms' },
    },
  },
  loadingExperience: {
    metrics: { INTERACTION_TO_NEXT_PAINT: { percentile: 180 } },
  },
};

describe('PsiService', () => {
  let psi: PsiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    psi = TestBed.inject(PsiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('maps a successful response into the domain shape', () => {
    let result: AuditResult | undefined;
    psi.audit('https://example.com', 'mobile').subscribe((value) => (result = value));

    const request = http.expectOne((req) => req.url === ENDPOINT);
    expect(request.request.params.get('strategy')).toBe('mobile');
    request.flush(body);

    expect(result?.score).toBe(87);
    expect(result?.finalUrl).toBe('https://example.com/');
    expect(result?.metrics.map((m) => m.id)).toEqual(['lcp', 'cls', 'tbt', 'inp']);
    expect(result?.metrics.find((m) => m.id === 'inp')?.source).toBe('field');
  });

  it('reports a client error as a domain error and does not retry it', () => {
    let failure: AuditError | undefined;
    psi.audit('https://example.com', 'mobile').subscribe({
      error: (error: AuditError) => (failure = error),
    });

    http.expectOne(() => true).flush('bad url', { status: 400, statusText: 'Bad Request' });

    expect(failure).toBeInstanceOf(AuditError);
    expect(failure?.kind).toBe('not-audited');
    expect(failure?.messageKey).toBe('errorNotAudited');
  });

  // fakeAsync would be the Angular way here, but it needs zone-testing and this
  // app runs zoneless, so the retry delays are driven by the Vitest fake clock.
  it('retries a server error with a growing delay and succeeds on the third try', async () => {
    installFakeClock();
    let result: AuditResult | undefined;
    psi.audit('https://example.com', 'desktop').subscribe((value) => (result = value));

    http.expectOne(() => true).flush('down', { status: 503, statusText: 'Service Unavailable' });
    await advanceClock(700);
    http.expectOne(() => true).flush('down', { status: 503, statusText: 'Service Unavailable' });
    await advanceClock(1400);
    http.expectOne(() => true).flush(body);

    expect(result?.strategy).toBe('desktop');
    uninstallFakeClock();
  });

  it('gives up after the retry budget', async () => {
    installFakeClock();
    let failure: AuditError | undefined;
    psi.audit('https://example.com', 'mobile').subscribe({
      error: (error: AuditError) => (failure = error),
    });

    http.expectOne(() => true).flush('down', { status: 500, statusText: 'Server Error' });
    await advanceClock(700);
    http.expectOne(() => true).flush('down', { status: 500, statusText: 'Server Error' });
    await advanceClock(1400);
    http.expectOne(() => true).flush('down', { status: 500, statusText: 'Server Error' });

    expect(failure?.kind).toBe('server');
    uninstallFakeClock();
  });

  it('runs mobile and desktop in parallel', () => {
    let pairUrl: string | undefined;
    psi.auditBoth('https://example.com').subscribe((pair) => (pairUrl = pair.url));

    const requests = http.match(() => true);
    expect(requests.length).toBe(2);
    requests.forEach((request) => request.flush(body));

    expect(pairUrl).toBe('https://example.com');
  });

  it('cancels the in flight request when switchMap moves to a new url', () => {
    const urls = new Subject<string>();
    urls.pipe(switchMap((url) => psi.audit(url, 'mobile'))).subscribe();

    urls.next('https://first.example');
    const first = http.expectOne(() => true);

    urls.next('https://second.example');
    expect(first.cancelled).toBe(true);

    http.expectOne((req) => req.params.get('url') === 'https://second.example').flush(body);
  });
});
