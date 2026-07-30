import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PsiResponse } from '../../core/psi/psi.models';
import { AuditPageComponent } from './audit-page';

const body: PsiResponse = {
  lighthouseResult: {
    categories: { performance: { score: 0.94 } },
    audits: {
      'largest-contentful-paint': { numericValue: 1900, displayValue: '1.9 s' },
      'cumulative-layout-shift': { numericValue: 0.02, displayValue: '0.02' },
    },
  },
};

describe('AuditPageComponent', () => {
  let fixture: ComponentFixture<AuditPageComponent>;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    // Karma runs in a real browser, so the locale would otherwise follow the
    // machine language and the message assertions would flip to Portuguese.
    localStorage.setItem('caliper.locale', 'en');
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(AuditPageComponent);
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  function submit(url: string) {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="url"]');
    input.value = url;
    input.dispatchEvent(new Event('input'));
    fixture.nativeElement
      .querySelector('form')
      .dispatchEvent(new Event('submit', { cancelable: true }));
    fixture.detectChanges();
  }

  it('starts with the empty history state and no results', () => {
    expect(fixture.nativeElement.querySelector('cal-empty-state')).not.toBeNull();
    expect(fixture.nativeElement.querySelectorAll('cal-audit-summary').length).toBe(0);
  });

  it('renders a card per strategy once both runs answer', () => {
    submit('https://example.com');

    const requests = http.match(() => true);
    expect(requests.length).toBe(2);
    requests.forEach((request) => request.flush(body));
    fixture.detectChanges();

    const summaries = fixture.nativeElement.querySelectorAll('cal-audit-summary');
    expect(summaries.length).toBe(2);
    expect(summaries[0].querySelector('.gauge-number').textContent.trim()).toBe('94');
    expect(fixture.nativeElement.querySelector('.history li')).not.toBeNull();
  });

  it('shows the domain error message and drops the sibling run', () => {
    submit('https://example.com');

    const [mobile, desktop] = http.match(() => true);
    mobile.flush('nope', { status: 400, statusText: 'Bad Request' });
    fixture.detectChanges();

    expect(desktop.cancelled).toBe(true);
    const alert = fixture.nativeElement.querySelector('[role="alert"]');
    expect(alert.textContent).toContain('could not load that page');
  });

  it('does not call the api for a url that fails validation', () => {
    submit('example.com');

    http.expectNone(() => true);
  });
});
