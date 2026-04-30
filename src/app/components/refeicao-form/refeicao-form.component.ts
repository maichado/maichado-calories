import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CaloriaService } from '../../services/caloria.service';
import { TipoRefeicao } from '../../models/refeicao.model';
import { animate, style, transition, trigger } from '@angular/animations';

type MealOption = {
  tipo: TipoRefeicao;
  label: string;
  emoji: string;
  placeholder: string;
};

const MEALS: MealOption[] = [
  { tipo: 'manha', label: 'Manhã', emoji: '🌅', placeholder: 'Ex.: café com leite, pão com ovo e suco...' },
  { tipo: 'almoco', label: 'Almoço', emoji: '🍽️', placeholder: 'Ex.: arroz, feijão, frango grelhado e salada...' },
  { tipo: 'tarde', label: 'Tarde', emoji: '🍎', placeholder: 'Ex.: banana, iogurte grego, castanhas...' },
  { tipo: 'noite', label: 'Noite', emoji: '🌙', placeholder: 'Ex.: omelete de 3 ovos, salada verde...' }
];

@Component({
  selector: 'app-refeicao-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="rf-wrap">
      <!-- Seletor de refeição -->
      <div class="rf-selector" role="group" aria-label="Selecione a refeição">
        @for (m of meals; track m.tipo) {
          <button
            class="rf-tab"
            type="button"
            [class.is-active]="selected() === m.tipo"
            (click)="select(m.tipo)"
            [attr.aria-pressed]="selected() === m.tipo"
          >
            <span class="rf-tab__emoji" aria-hidden="true">{{ m.emoji }}</span>
            <span class="rf-tab__label">{{ m.label }}</span>
            @if (savedKcal()[m.tipo]) {
              <span class="rf-tab__badge">{{ savedKcal()[m.tipo] }}</span>
            }
          </button>
        }
      </div>

      <!-- Form da refeição ativa -->
      @if (activeMeal(); as m) {
        <div class="rf-card mc-card" [@slide]>
          <div class="mc-card__inner">
            <div class="rf-card__top">
              <span class="rf-card__emoji" aria-hidden="true">{{ m.emoji }}</span>
              <div>
                <h3 class="mc-title">{{ m.label }}</h3>
                <p class="mc-subtitle">Descreva o que você comeu</p>
              </div>
            </div>

            <textarea
              class="mc-input rf-textarea"
              [(ngModel)]="textByMeal[m.tipo]"
              [placeholder]="m.placeholder"
              rows="4"
            ></textarea>

            <button
              class="mc-btn mc-btn--primary rf-calc-btn"
              type="button"
              (click)="calcular(m.tipo)"
              [disabled]="saving()"
            >
              @if (saving()) {
                <span>Estimando com IA...</span>
              } @else {
                <span>⚡ Calcular calorias com IA</span>
              }
            </button>

            @if (resultByMeal()[m.tipo]; as res) {
              <div class="rf-result" [@fadeIn]>
                <div class="rf-result__top">
                  <div class="rf-result__kcal">{{ res.kcal }} <span>kcal</span></div>
                  <span class="mc-chip rf-result__chip">Estimativa {{ res.provider === 'openai' ? 'IA' : 'local' }}</span>
                </div>
                @if (res.explicacao) {
                  <p class="rf-result__exp">{{ res.explicacao }}</p>
                }
                <button
                  class="mc-btn mc-btn--primary rf-save-btn"
                  type="button"
                  (click)="salvar(m.tipo)"
                >
                  ✅ Salvar refeição
                </button>
              </div>
            }

            @if (msgByMeal()[m.tipo]; as msg) {
              <div class="rf-msg">{{ msg }}</div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styleUrl: './refeicao-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(8px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('180ms ease', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class RefeicaoFormComponent {
  private readonly caloria = inject(CaloriaService);

  protected readonly meals = MEALS;
  protected readonly selected = signal<TipoRefeicao>('manha');
  protected readonly saving = signal(false);

  protected readonly savedKcal = signal<Partial<Record<TipoRefeicao, number>>>({});
  protected readonly resultByMeal = signal<Partial<Record<TipoRefeicao, { kcal: number; explicacao: string; provider: string }>>>({});
  protected readonly msgByMeal = signal<Partial<Record<TipoRefeicao, string>>>({});

  protected readonly textByMeal: Partial<Record<TipoRefeicao, string>> = {};

  protected readonly activeMeal = computed(() => MEALS.find(m => m.tipo === this.selected())!);

  protected select(tipo: TipoRefeicao): void {
    this.selected.set(tipo);
  }

  protected async calcular(tipo: TipoRefeicao): Promise<void> {
    const text = (this.textByMeal[tipo] ?? '').trim();
    if (!text) {
      this.msgByMeal.update(m => ({ ...m, [tipo]: 'Digite o que você comeu primeiro.' }));
      return;
    }
    this.saving.set(true);
    this.resultByMeal.update(m => ({ ...m, [tipo]: undefined }));
    this.msgByMeal.update(m => ({ ...m, [tipo]: '' }));
    try {
      const r = await this.caloria.estimateCalories(text);
      this.resultByMeal.update(m => ({
        ...m,
        [tipo]: { kcal: r.calories, explicacao: r.explanation, provider: r.provider }
      }));
    } catch {
      this.msgByMeal.update(m => ({ ...m, [tipo]: 'Erro ao estimar. Tente novamente.' }));
    } finally {
      this.saving.set(false);
    }
  }

  protected async salvar(tipo: TipoRefeicao): Promise<void> {
    const text = (this.textByMeal[tipo] ?? '').trim();
    const res = this.resultByMeal()[tipo];
    if (!text || !res) return;
    await this.caloria.registrarRefeicao(tipo, text);
    this.savedKcal.update(m => ({ ...m, [tipo]: res.kcal }));
    this.msgByMeal.update(m => ({ ...m, [tipo]: '✅ Refeição salva!' }));
    this.resultByMeal.update(m => ({ ...m, [tipo]: undefined }));
    (this.textByMeal as any)[tipo] = '';
    setTimeout(() => this.msgByMeal.update(m => ({ ...m, [tipo]: '' })), 2200);
  }
}
