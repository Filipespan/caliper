import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Rating } from '../rating';

@Component({
  selector: 'cal-metric-bar',
  templateUrl: './metric-bar.html',
  styleUrl: './metric-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricBarComponent {
  readonly label = input.required<string>();
  readonly display = input.required<string>();
  readonly value = input.required<number>();
  readonly rating = input.required<Rating>();
  readonly goodMax = input.required<number>();
  readonly poorMin = input.required<number>();

  /** Scale end. A value past the poor threshold still has room to move. */
  protected readonly scaleMax = computed(() => Math.max(this.poorMin() * 1.5, this.value() * 1.1));

  protected readonly goodWidth = computed(() => this.percent(this.goodMax()));
  protected readonly averageWidth = computed(() => this.percent(this.poorMin()) - this.goodWidth());
  protected readonly markerX = computed(() => Math.min(this.percent(this.value()), 99.4));

  private percent(value: number): number {
    return (value / this.scaleMax()) * 100;
  }
}
