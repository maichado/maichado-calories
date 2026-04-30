import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GraficoPesoComponent } from '../../components/grafico-peso/grafico-peso.component';
import { PesoService } from '../../services/peso.service';
import { StorageService } from '../../services/storage.service';
import { InViewAnimateDirective } from '../../shared/directives/in-view-animate.directive';

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

@Component({
  selector: 'app-peso-page',
  standalone: true,
  imports: [FormsModule, GraficoPesoComponent, InViewAnimateDirective],
  template: `
    <section class="mc-grid" appInViewAnimate>
      <div class="mc-card">
        <div class="mc-card__inner">
          <h2 class="mc-title peso__title">Controle de peso</h2>
          <p class="mc-subtitle">
            Registre seu peso diário e acompanhe se o ritmo atual te leva para a meta no prazo.
          </p>

          <div class="mc-form peso__form">
            <div class="mc-row">
              <label class="mc-field">
                Data
                <input class="mc-input" type="date" [(ngModel)]="dataISO" name="dataISO" />
              </label>
              <label class="mc-field">
                Peso (kg)
                <input class="mc-input" type="number" step="0.1" min="30" [(ngModel)]="pesoKg" name="pesoKg" />
              </label>
            </div>
            <div class="peso__actions">
              <button class="mc-btn mc-btn--primary" type="button" (click)="salvarPeso()">Salvar pesagem</button>
            </div>
            @if (msg(); as m) {
              <p class="peso__msg">{{ m }}</p>
            }
          </div>
        </div>
      </div>

      <div class="mc-grid mc-grid--2">
        <div class="mc-card">
          <div class="mc-card__inner">
            <h3 class="mc-title">Resumo atual</h3>
            <p class="mc-subtitle">Último registro e projeção para a meta</p>
            <ul class="peso__list">
              <li><strong>Último peso:</strong> {{ ultimoPeso() }}</li>
              <li><strong>Ritmo semanal:</strong> {{ ritmoSemanal() }}</li>
              <li><strong>Status:</strong> {{ statusMeta() }}</li>
            </ul>
          </div>
        </div>
        <div class="mc-card">
          <div class="mc-card__inner">
            <h3 class="mc-title">Meta semanal</h3>
            <p class="mc-subtitle">
              O sistema considera 1,5 kg/semana como referência para progresso saudável.
            </p>
            <span class="mc-chip">1.5 kg por semana</span>
          </div>
        </div>
      </div>

      <app-grafico-peso [labels]="chartLabels()" [values]="chartValues()" />
    </section>
  `,
  styles: [`
    .peso__title{font-size:24px}
    .peso__form{margin-top:14px}
    .peso__actions{display:flex;justify-content:flex-end}
    .peso__msg{margin:10px 0 0;color:var(--mc-green);font-weight:700}
    .peso__list{margin:14px 0 0;padding-left:18px;display:grid;gap:6px;color:var(--mc-text-2)}
    .peso__list strong{color:var(--mc-text)}
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PesoPage {
  private readonly pesoService = inject(PesoService);
  private readonly storage = inject(StorageService);
  protected readonly msg = signal('');

  protected dataISO = isoDate(new Date());
  protected pesoKg = this.storage.load().usuario?.pesoAtualKg ?? 80;

  private readonly schema = computed(() => this.storage.load());
  private readonly pesos = computed(() =>
    Object.values(this.schema().pesos).sort((a, b) => a.dataISO.localeCompare(b.dataISO))
  );

  protected readonly chartLabels = computed(() => this.pesos().slice(-20).map((p) => p.dataISO.slice(5)));
  protected readonly chartValues = computed(() => this.pesos().slice(-20).map((p) => p.pesoKg));

  protected readonly ultimoPeso = computed(() => {
    const last = this.pesos().at(-1);
    return last ? `${last.pesoKg.toFixed(1)} kg (${last.dataISO})` : 'Sem registro ainda';
  });

  protected readonly ritmoSemanal = computed(() => {
    const entries = this.pesos();
    if (entries.length < 2) return 'Dados insuficientes';
    const first = entries[0];
    const last = entries[entries.length - 1];
    const days = Math.max(1, (new Date(last.dataISO).getTime() - new Date(first.dataISO).getTime()) / 86400000);
    const perWeek = ((last.pesoKg - first.pesoKg) / days) * 7;
    return `${perWeek >= 0 ? '+' : ''}${perWeek.toFixed(2)} kg/semana`;
  });

  protected readonly statusMeta = computed(() => {
    const u = this.schema().usuario;
    if (!u) return 'Defina seu perfil para medir com precisão.';
    const now = u.pesoAtualKg;
    if (now === u.pesoMetaKg) return 'Meta atingida.';
    return now > u.pesoMetaKg ? 'Em processo de perda.' : 'Em processo de ganho.';
  });

  protected salvarPeso(): void {
    if (!this.pesoKg || this.pesoKg < 30) {
      this.msg.set('Informe um peso válido.');
      return;
    }
    this.pesoService.setPeso(Number(this.pesoKg), this.dataISO);
    this.msg.set('Peso registrado com sucesso.');
    setTimeout(() => this.msg.set(''), 1800);
  }
}

