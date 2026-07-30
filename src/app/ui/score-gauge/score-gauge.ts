import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Rating } from '../rating';

const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

@Component({
  selector: 'cal-score-gauge',
  templateUrl: './score-gauge.html',
  styleUrl: './score-gauge.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreGaugeComponent {
  readonly score = input.required<number | null>();
  readonly label = input.required<string>();
  readonly ariaLabel = input<string | null>(null);

  protected readonly radius = RADIUS;

  protected readonly rating = computed<Rating>(() => {
    const score = this.score();
    if (score === null || score < 50) {
      return 'poor';
    }
    return score < 90 ? 'needs-improvement' : 'good';
  });

  protected readonly dashArray = computed(() => {
    const filled = ((this.score() ?? 0) / 100) * CIRCUMFERENCE;
    return `${filled} ${CIRCUMFERENCE - filled}`;
  });

  protected readonly display = computed(() => {
    const score = this.score();
    return score === null ? '--' : String(score);
  });

  protected readonly describedLabel = computed(
    () => this.ariaLabel() ?? `${this.label()}: ${this.display()}`,
  );
}
