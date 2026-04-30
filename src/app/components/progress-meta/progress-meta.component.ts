import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-progress-meta',
  standalone: true,
  template: `
    <div class="mc-card" [@in]>
      <div class="mc-card__inner">
        <div class="mc-progress__top">
          <div>
            <h3 class="mc-title">Meta de peso</h3>
            <p class="mc-subtitle">{{ subtitle() }}</p>
          </div>
          <span class="mc-chip">{{ percent() }}%</span>
        </div>

        <div class="mc-progress__bar" role="progressbar" [attr.aria-valuenow]="percent()">
          <div class="mc-progress__barFill" [style.width.%]="percent()"></div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './progress-meta.component.scss',
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
export class ProgressMetaComponent {
  pesoInicialKg = input.required<number>();
  pesoAtualKg = input.required<number>();
  pesoMetaKg = input.required<number>();

  protected readonly percent = computed(() => {
    const start = this.pesoInicialKg();
    const current = this.pesoAtualKg();
    const goal = this.pesoMetaKg();
    const total = Math.abs(goal - start);
    if (total < 1e-6) return 100;
    const done = Math.abs(current - start);
    return Math.max(0, Math.min(100, Math.round((done / total) * 100)));
  });

  protected readonly subtitle = computed(() => {
    return `${this.pesoAtualKg().toFixed(1)} kg → ${this.pesoMetaKg().toFixed(1)} kg`;
  });
}

