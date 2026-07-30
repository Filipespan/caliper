import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Rating } from '../rating';

@Component({
  selector: 'cal-status-pill',
  template: `<span class="pill" [attr.data-rating]="rating()">{{ label() }}</span>`,
  styleUrl: './status-pill.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusPillComponent {
  readonly rating = input.required<Rating>();
  readonly label = input.required<string>();
}
