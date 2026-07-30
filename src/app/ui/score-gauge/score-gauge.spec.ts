import { TestBed } from '@angular/core/testing';
import { ScoreGaugeComponent } from './score-gauge';

describe('ScoreGaugeComponent', () => {
  function render(score: number | null, ariaLabel: string | null = null) {
    const fixture = TestBed.createComponent(ScoreGaugeComponent);
    fixture.componentRef.setInput('score', score);
    fixture.componentRef.setInput('label', 'Mobile');
    fixture.componentRef.setInput('ariaLabel', ariaLabel);
    fixture.detectChanges();
    return fixture;
  }

  it('exposes the score to assistive technology, not only to sighted users', () => {
    const svg = render(87).nativeElement.querySelector('svg');

    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.getAttribute('aria-label')).toBe('Mobile: 87');
  });

  it('prefers a caller supplied aria label so the app can translate it', () => {
    const svg = render(42, 'Desempenho no celular: 42 de 100').nativeElement.querySelector('svg');

    expect(svg.getAttribute('aria-label')).toBe('Desempenho no celular: 42 de 100');
  });

  it('renders a placeholder instead of zero when there is no score', () => {
    const fixture = render(null);
    const text = fixture.nativeElement.querySelector('.gauge-number').textContent.trim();

    expect(text).toBe('--');
    expect(fixture.nativeElement.querySelector('.gauge').dataset.rating).toBe('poor');
  });

  it('moves between rating bands at 50 and 90', () => {
    const bandOf = (score: number) =>
      render(score).nativeElement.querySelector('.gauge').dataset.rating;

    expect(bandOf(49)).toBe('poor');
    expect(bandOf(50)).toBe('needs-improvement');
    expect(bandOf(89)).toBe('needs-improvement');
    expect(bandOf(90)).toBe('good');
  });
});
