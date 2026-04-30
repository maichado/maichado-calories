import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-card-metrica',
  standalone: true,
  template: `
    <div class="mc-card mc-metric" [@in]>
      <div class="mc-card__inner mc-metric__inner">
        <div class="mc-metric__top">
          <div class="mc-metric__label">{{ label() }}</div>
          @if (chip(); as c) {
            <span class="mc-chip">{{ c }}</span>
          }
        </div>
        <div class="mc-metric__value">{{ value() }}</div>
        @if (hint(); as h) {
          <div class="mc-metric__hint">{{ h }}</div>
        }
      </div>
    </div>
  `,
  styleUrl: './card-metrica.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('in', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(6px)' }),
        animate('180ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class CardMetricaComponent {
  label = input.required<string>();
  value = input.required<string>();
  hint = input<string | undefined>();
  chip = input<string | undefined>();
}

