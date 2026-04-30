import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GraficoCaloriasComponent } from '../../components/grafico-calorias/grafico-calorias.component';
import { GraficoPesoComponent } from '../../components/grafico-peso/grafico-peso.component';
import { ProgressMetaComponent } from '../../components/progress-meta/progress-meta.component';
import { CaloriaService } from '../../services/caloria.service';
import { MetaService } from '../../services/meta.service';
import { PesoService } from '../../services/peso.service';
import { StorageService } from '../../services/storage.service';
import { TipoRefeicao } from '../../models/refeicao.model';
import { Usuario } from '../../models/usuario.model';
import { InViewAnimateDirective } from '../../shared/directives/in-view-animate.directive';

function isoDate(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function addDays(d: Date, days: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function calcTmb(usuario: Usuario): { tmb: number; usedDefaults: boolean } {
  const sexo = usuario.sexo ?? 'M';
  const alturaCm = usuario.alturaCm ?? 170;
  const usedDefaults = usuario.sexo == null || usuario.alturaCm == null;

  // Harris-Benedict revisada (Roza & Shizgal)
  const w = usuario.pesoAtualKg;
  const h = alturaCm;
  const a = usuario.idade;
  const tmb =
    sexo === 'F'
      ? 447.593 + 9.247 * w + 3.098 * h - 4.33 * a
      : 88.362 + 13.397 * w + 4.799 * h - 5.677 * a;

  return { tmb: Math.max(0, Math.round(tmb)), usedDefaults };
}

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    ProgressMetaComponent,
    GraficoPesoComponent,
    GraficoCaloriasComponent,
    RouterLink,
    InViewAnimateDirective
  ],
  template: `
    <section class="mc-grid" appInViewAnimate>
      @if (loading()) {
        <div class="mc-card">
          <div class="mc-card__inner">
            <div class="mc-skeleton" style="height: 18px; width: 160px"></div>
            <div style="height: 10px"></div>
            <div class="mc-skeleton" style="height: 10px; width: 260px"></div>
            <div style="height: 16px"></div>
            <div class="mc-skeleton" style="height: 110px; width: 100%"></div>
          </div>
        </div>
      } @else {
        <header class="mc-dash__hero">
          <div>
            <div class="mc-dash__greet">{{ saudacao() }}@if (primeiroNome(); as n) {, {{ n }} }</div>
            <div class="mc-dash__mot">{{ fraseMotivacional() }}</div>
          </div>
          <span class="mc-chip">Hoje</span>
        </header>

        @if (!usuario()) {
          <div class="mc-card">
            <div class="mc-card__inner">
              <h2 class="mc-title">Complete seu Perfil</h2>
              <p class="mc-subtitle">
                Para personalizar a meta diária, TMB e metas semanais, preencha seus dados em Perfil.
              </p>
              <a class="mc-btn mc-btn--primary" routerLink="/perfil">Ir para Perfil</a>
            </div>
          </div>
        } @else {
          <div class="mc-card mc-dash__kcal">
            <div class="mc-card__inner mc-dash__kcalInner">
              <div class="mc-dash__kcalTop">
                <div class="mc-dash__kcalMeta">Meta diária: {{ goalKcal() }} kcal</div>
                <span class="mc-chip" [class]="kcalChipClass()">{{ kcalChipText() }}</span>
              </div>

              <div class="mc-ring" aria-label="Progresso de calorias do dia">
                <svg viewBox="0 0 120 120" class="mc-ring__svg" aria-hidden="true">
                  <circle class="mc-ring__bg" cx="60" cy="60" r="46" />
                  <circle
                    class="mc-ring__fg"
                    cx="60"
                    cy="60"
                    r="46"
                    [style.stroke-dashoffset]="ringOffset()"
                    [class.is-warn]="kcalState() === 'warn'"
                    [class.is-over]="kcalState() === 'over'"
                  />
                </svg>
                <div class="mc-ring__center">
                  <div class="mc-ring__value">{{ totalKcal() }}</div>
                  <div class="mc-ring__label">kcal consumidas</div>
                  <div class="mc-ring__rest">
                    {{ remainingLabel() }} restantes
                  </div>
                </div>
              </div>

              <div class="mc-dash__meals" aria-label="Resumo por refeição">
                @for (m of mealCards(); track m.tipo) {
                  <div class="mc-dash__meal">
                    <span class="mc-dash__mealEmoji" aria-hidden="true">{{ m.emoji }}</span>
                    <div class="mc-dash__mealName">{{ m.label }}</div>
                    <div class="mc-dash__mealKcal">{{ m.kcal }}</div>
                  </div>
                }
              </div>
            </div>
          </div>

          @if (usuario(); as u) {
            <div class="mc-card">
              <div class="mc-card__inner">
                <div class="mc-dash__weightTop">
                  <div>
                    <h3 class="mc-title">Progresso do peso</h3>
                    <p class="mc-subtitle">{{ pesoHint() }}</p>
                  </div>
                  <span class="mc-chip">{{ u.pesoAtualKg.toFixed(1) }} → {{ u.pesoMetaKg.toFixed(1) }} kg</span>
                </div>
                <app-progress-meta
                  [pesoInicialKg]="u.pesoInicialKg"
                  [pesoAtualKg]="u.pesoAtualKg"
                  [pesoMetaKg]="u.pesoMetaKg"
                />
              </div>
            </div>

            <div class="mc-card">
              <div class="mc-card__inner">
                <div class="mc-dash__weekTop">
                  <div>
                    <h3 class="mc-title">Metas semanais</h3>
                    <p class="mc-subtitle">Status visual das próximas semanas</p>
                  </div>
                  <span class="mc-chip">Alvo 1.5 kg/semana</span>
                </div>
                <div class="mc-meta__list">
                  @for (m of metasSemanais(); track m.semanaInicioISO) {
                    <div class="mc-meta__item">
                      <div class="mc-meta__left">
                        <div class="mc-meta__range">
                          {{ m.semanaInicioISO }} → {{ m.semanaFimISO }}
                        </div>
                        <div class="mc-meta__target">Alvo: {{ m.pesoAlvoKg.toFixed(1) }} kg</div>
                      </div>
                      <span class="mc-chip" [class]="'mc-chip--' + m.status">
                        {{ m.status }}
                      </span>
                    </div>
                  }
                </div>
              </div>
            </div>

            <app-grafico-peso [labels]="pesoChartLabels()" [values]="pesoChartValues()" />
            <app-grafico-calorias [labels]="kcalChartLabels()" [values]="kcalChartValues()" />
          }
        }
      }
    </section>
  `,
  styleUrl: './dashboard.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPage {
  private readonly storage = inject(StorageService);
  private readonly pesoService = inject(PesoService);
  private readonly caloriaService = inject(CaloriaService);
  private readonly metaService = inject(MetaService);

  protected readonly loading = signal(true);

  protected readonly schema = signal(this.storage.load());
  protected readonly usuario = computed(() => this.schema().usuario);

  protected readonly metasSemanais = computed(() => this.metaService.gerarMetasSemanais().slice(0, 6));

  private readonly todayISO = isoDate(new Date());
  protected readonly diarioHoje = computed(() => this.schema().diarios[this.todayISO]);

  protected readonly totalKcal = computed(() => this.caloriaService.getTotalDoDia(this.todayISO));

  protected readonly tmbInfo = computed(() => {
    const u = this.usuario();
    return u ? calcTmb(u) : { tmb: 0, usedDefaults: true };
  });

  protected readonly goalKcal = computed(() => this.tmbInfo().tmb || 2000);

  protected readonly remainingKcal = computed(() =>
    Math.max(0, Math.round(this.goalKcal() - this.totalKcal()))
  );

  protected readonly kcalPercent = computed(() => {
    const goal = Math.max(1, this.goalKcal());
    return clamp01(this.totalKcal() / goal);
  });

  private readonly ringCirc = 2 * Math.PI * 46;
  protected readonly ringOffset = computed(() => {
    const p = this.kcalPercent();
    return String(this.ringCirc * (1 - p));
  });

  protected readonly kcalState = computed<'ok' | 'warn' | 'over'>(() => {
    const total = this.totalKcal();
    const goal = this.goalKcal();
    if (total > goal) return 'over';
    if (total >= goal * 0.85) return 'warn';
    return 'ok';
  });

  protected readonly remainingLabel = computed(() => `${this.remainingKcal()}`);

  protected readonly kcalChipText = computed(() => {
    const st = this.kcalState();
    if (st === 'over') return 'Acima da meta';
    if (st === 'warn') return 'Perto do limite';
    return 'Dentro da meta';
  });

  protected readonly kcalChipClass = computed(() => {
    const st = this.kcalState();
    if (st === 'over') return 'mc-chip--danger';
    if (st === 'warn') return 'mc-chip--warn';
    return 'mc-chip--ok';
  });

  protected readonly primeiroNome = computed(() => {
    const n = (this.usuario()?.nome ?? '').trim();
    return n ? n.split(/\s+/)[0] : '';
  });

  protected readonly saudacao = computed(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  });

  protected readonly fraseMotivacional = computed(() => {
    const frases = [
      'Pequenos hábitos hoje, grande resultado amanhã.',
      'Consistência vence intensidade.',
      'Você está cuidando de você — continue.',
      'Um registro por vez. Uma vitória por dia.',
      'Seu progresso é a soma do que você repete.'
    ];
    const idx = new Date().getDate() % frases.length;
    return frases[idx]!;
  });

  protected readonly mealCards = computed(() => {
    const diario = this.diarioHoje();
    const get = (t: TipoRefeicao) => diario?.refeicoes?.[t]?.calorias ?? 0;
    return [
      { tipo: 'manha' as const, label: 'Manhã', emoji: '🌅', kcal: get('manha') },
      { tipo: 'almoco' as const, label: 'Almoço', emoji: '🍽️', kcal: get('almoco') },
      { tipo: 'tarde' as const, label: 'Tarde', emoji: '🍎', kcal: get('tarde') },
      { tipo: 'noite' as const, label: 'Noite', emoji: '🌙', kcal: get('noite') }
    ];
  });

  protected readonly deficit = computed(() => {
    const u = this.usuario();
    if (!u) return 0;
    return Math.round(this.tmbInfo().tmb - this.totalKcal());
  });

  constructor() {
    // Small shimmer delay for a smoother first paint.
    setTimeout(() => {
      this.schema.set(this.storage.load());
      this.loading.set(false);
    }, 260);
  }

  protected pesoAtualLabel = computed(() => {
    const u = this.usuario();
    if (!u) return '—';
    return `${u.pesoAtualKg.toFixed(1)} kg`;
  });

  protected pesoMetaLabel = computed(() => {
    const u = this.usuario();
    if (!u) return '—';
    return `${u.pesoMetaKg.toFixed(1)} kg`;
  });

  protected pesoHint = computed(() => {
    const last = this.pesoService.getUltimoRegistro();
    if (!last) return 'Sem registro de peso ainda.';
    return `Último registro: ${last.dataISO}`;
  });

  protected metaHint = computed(() => {
    const u = this.usuario();
    if (!u) return 'Defina seu objetivo no Perfil.';
    return `Início: ${u.dataInicioISO} • Meta: ${u.dataMetaISO}`;
  });

  protected totalKcalLabel = computed(() => `${this.totalKcal()} kcal`);

  protected kcalPorRefeicaoHint = computed(() => {
    const diario = this.diarioHoje();
    if (!diario) return 'Nenhuma refeição registrada hoje.';
    const tipos: TipoRefeicao[] = ['manha', 'almoco', 'tarde', 'noite'];
    const label: Record<TipoRefeicao, string> = {
      manha: 'Manhã',
      almoco: 'Almoço',
      tarde: 'Tarde',
      noite: 'Noite'
    };
    return tipos
      .map((t) => `${label[t]}: ${diario.refeicoes?.[t]?.calorias ?? 0} kcal`)
      .join(' • ');
  });

  protected deficitLabel = computed(() => {
    const u = this.usuario();
    if (!u) return '—';
    const d = this.deficit();
    return `${d} kcal`;
  });

  protected tmbChip = computed(() => `TMB ${this.tmbInfo().tmb} kcal`);

  protected tmbHint = computed(() => {
    const u = this.usuario();
    if (!u) return 'Configure o Perfil.';
    return this.tmbInfo().usedDefaults
      ? 'TMB calculada com defaults (sexo=M, altura=170cm). Ajuste no Perfil para precisão.'
      : 'TMB calculada com sexo/altura do Perfil.';
  });

  protected pesoChartLabels = computed(() => {
    const s = this.schema();
    const entries = Object.values(s.pesos).sort((a, b) => a.dataISO.localeCompare(b.dataISO));
    const last = entries.slice(-14);
    return last.map((e) => e.dataISO.slice(5)); // mm-dd
  });

  protected pesoChartValues = computed(() => {
    const s = this.schema();
    const entries = Object.values(s.pesos).sort((a, b) => a.dataISO.localeCompare(b.dataISO));
    return entries.slice(-14).map((e) => e.pesoKg);
  });

  protected kcalChartLabels = computed(() => {
    const base = new Date();
    const days = Array.from({ length: 7 }, (_, i) => addDays(base, -6 + i));
    return days.map((d) => isoDate(d).slice(5)); // mm-dd
  });

  protected kcalChartValues = computed(() => {
    const base = new Date();
    const days = Array.from({ length: 7 }, (_, i) => addDays(base, -6 + i));
    return days.map((d) => this.caloriaService.getTotalDoDia(isoDate(d)));
  });
}

