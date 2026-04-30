import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { InViewAnimateDirective } from '../../shared/directives/in-view-animate.directive';

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

@Component({
  selector: 'app-historico-page',
  standalone: true,
  imports: [InViewAnimateDirective],
  template: `
    <section class="mc-grid" appInViewAnimate>
      <div class="mc-card">
        <div class="mc-card__inner">
          <h2 class="mc-title historico__title">Histórico</h2>
          <p class="mc-subtitle">Calendário de registros e exportação em CSV.</p>
          <button class="mc-btn mc-btn--outline historico__export" type="button" (click)="exportCsv()">
            Exportar CSV
          </button>
        </div>
      </div>

      <div class="mc-card">
        <div class="mc-card__inner">
          <h3 class="mc-title">Dias registrados (mês atual)</h3>
          <div class="historico__calendar">
            @for (d of monthDays(); track d.iso) {
              <button
                class="historico__day"
                [class.is-active]="d.hasData"
                type="button"
                (click)="selectedISO.set(d.iso)"
              >
                <span>{{ d.label }}</span>
              </button>
            }
          </div>
        </div>
      </div>

      <div class="mc-card">
        <div class="mc-card__inner">
          <h3 class="mc-title">Resumo do dia</h3>
          @if (selectedSummary(); as s) {
            <ul class="historico__summary">
              <li><strong>Data:</strong> {{ s.iso }}</li>
              <li><strong>Total calorias:</strong> {{ s.totalKcal }} kcal</li>
              <li><strong>Peso:</strong> {{ s.pesoLabel }}</li>
            </ul>
          } @else {
            <p class="mc-subtitle">Selecione um dia para ver detalhes.</p>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .historico__title{font-size:24px}
    .historico__export{margin-top:12px}
    .historico__calendar{margin-top:14px;display:grid;grid-template-columns:repeat(7,1fr);gap:8px}
    .historico__day{border:1px solid var(--mc-border-2);background:#fff;border-radius:10px;min-height:38px;cursor:pointer}
    .historico__day.is-active{background:var(--mc-green-bg);border-color:var(--mc-green-mid);color:var(--mc-green)}
    .historico__summary{margin:14px 0 0;padding-left:18px;display:grid;gap:6px;color:var(--mc-text-2)}
    .historico__summary strong{color:var(--mc-text)}
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoricoPage {
  private readonly storage = inject(StorageService);
  protected readonly selectedISO = signal<string>(isoDate(new Date()));
  private readonly schema = computed(() => this.storage.load());

  protected readonly monthDays = computed(() => {
    const now = new Date();
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const result: Array<{ iso: string; label: number; hasData: boolean }> = [];

    for (let d = 1; d <= last.getDate(); d++) {
      const date = new Date(now.getFullYear(), now.getMonth(), d);
      const iso = isoDate(date);
      result.push({
        iso,
        label: d,
        hasData: !!this.schema().diarios[iso] || !!this.schema().pesos[iso]
      });
    }
    return result;
  });

  protected readonly selectedSummary = computed(() => {
    const iso = this.selectedISO();
    if (!iso) return null;
    const diario = this.schema().diarios[iso];
    const peso = this.schema().pesos[iso];
    const totalKcal = diario
      ? Object.values(diario.refeicoes).reduce((sum, r) => sum + (r?.calorias ?? 0), 0)
      : 0;
    return {
      iso,
      totalKcal,
      pesoLabel: peso ? `${peso.pesoKg.toFixed(1)} kg` : 'Sem pesagem'
    };
  });

  protected exportCsv(): void {
    const s = this.schema();
    const allDates = Array.from(new Set([...Object.keys(s.diarios), ...Object.keys(s.pesos)])).sort();
    const lines = [
      'data,total_kcal,peso_kg',
      ...allDates.map((iso) => {
        const diario = s.diarios[iso];
        const peso = s.pesos[iso];
        const totalKcal = diario
          ? Object.values(diario.refeicoes).reduce((sum, r) => sum + (r?.calorias ?? 0), 0)
          : 0;
        return `${iso},${totalKcal},${peso?.pesoKg ?? ''}`;
      })
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vivae-historico.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
}

