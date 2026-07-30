import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PsiResponse } from '../../core/psi/psi.models';
import { CompareProgress, CompareQueueService } from './compare-queue.service';

const body: PsiResponse = {
  lighthouseResult: {
    categories: { performance: { score: 0.5 } },
    audits: { 'largest-contentful-paint': { numericValue: 3000, displayValue: '3.0 s' } },
  },
};

describe('CompareQueueService', () => {
  let queue: CompareQueueService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    queue = TestBed.inject(CompareQueueService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  function urlOf(index: number) {
    return `https://site-${index}.example`;
  }

  it('sends one request at a time, in the order the urls were given', () => {
    const seen: CompareProgress[] = [];
    queue.run([urlOf(1), urlOf(2), urlOf(3)]).subscribe((progress) => seen.push(progress));

    // Only the first url may be in flight while nothing has answered yet.
    const firstBatch = http.match(() => true);
    expect(firstBatch.length).toBe(1);
    expect(firstBatch[0].request.params.get('url')).toBe(urlOf(1));
    firstBatch[0].flush(body);

    const secondBatch = http.match(() => true);
    expect(secondBatch.length).toBe(1);
    expect(secondBatch[0].request.params.get('url')).toBe(urlOf(2));
    secondBatch[0].flush(body);

    http.expectOne((req) => req.params.get('url') === urlOf(3)).flush(body);

    expect(seen.at(-1)?.rows.map((row) => row.url)).toEqual([urlOf(1), urlOf(2), urlOf(3)]);
    expect(seen.at(-1)?.finished).toBe(true);
  });

  it('keeps the queue moving when one url fails', () => {
    let latest: CompareProgress | undefined;
    queue.run([urlOf(1), urlOf(2)]).subscribe((progress) => (latest = progress));

    http
      .expectOne((req) => req.params.get('url') === urlOf(1))
      .flush('nope', { status: 400, statusText: 'Bad Request' });
    http.expectOne((req) => req.params.get('url') === urlOf(2)).flush(body);

    expect(latest?.rows[0].error?.kind).toBe('not-audited');
    expect(latest?.rows[1].result?.score).toBe(50);
    expect(latest?.finished).toBe(true);
  });

  it('reports progress before the first response arrives', () => {
    let first: CompareProgress | undefined;
    queue.run([urlOf(1), urlOf(2)]).subscribe((progress) => (first ??= progress));

    expect(first).toEqual({ rows: [], total: 2, finished: false });

    http.expectOne(() => true).flush(body);
    http.expectOne(() => true).flush(body);
  });
});
