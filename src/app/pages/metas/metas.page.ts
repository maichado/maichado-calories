import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MetaService } from '../../services/meta.service';
import { StorageService } from '../../services/storage.service';
import { InViewAnimateDirective } from '../../shared/directives/in-view-animate.directive';

@Component({
  selector: 'app-metas-page',
  standalone: true,
  imports: [InViewAnimateDirective],
  template: `
    <section class="mc-grid" appInViewAnimate>
      <div class="mc-card">
        <div class="mc-card__inner">
          <h2 class="mc-title metas__title">Metas semanais</h2>
          <p class="mc-subtitle">
            Metas geradas automaticamente com base no seu peso inicial, meta e data final.
          </p>
        </div>
      </div>

      @if (!hasUsuario()) {
        <div class="mc-card">
          <div class="mc-card__inner">
            <p class="mc-subtitle">Preencha seu perfil para visualizar as metas automaticamente.</p>
          </div>
        </div>
      } @else {
        <div class="mc-card">
          <div class="mc-card__inner">
            <div class="metas__list">
              @for (m of metas(); track m.semanaInicioISO) {
                <article class="metas__item">
                  <div>
                    <strong>{{ m.semanaInicioISO }} → {{ m.semanaFimISO }}</strong>
                    <p>Alvo da semana: {{ m.pesoAlvoKg.toFixed(1) }} kg</p>
                  </div>
                  <span class="mc-chip" [class]="'mc-chip--' + m.status">{{ m.status }}</span>
                </article>
              }
            </div>
          </div>
        </div>
      }
    </section>
  `,
  styles: [`
    .metas__title{font-size:24px}
    .metas__list{display:grid;gap:10px}
    .metas__item{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px;border:1px solid var(--mc-border-2);border-radius:14px;background:#fff}
    .metas__item p{margin:4px 0 0;color:var(--mc-text-2)}
    .mc-chip--batida{background:var(--mc-green-bg);border-color:var(--mc-green-mid);color:var(--mc-green)}
    .mc-chip--pendente{background:#fffbf0;border-color:rgba(243,156,18,.25);color:var(--mc-warning)}
    .mc-chip--atrasada{background:#fff5f5;border-color:rgba(231,76,60,.25);color:var(--mc-danger)}
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetasPage {
  private readonly metaService = inject(MetaService);
  private readonly storage = inject(StorageService);

  protected readonly hasUsuario = computed(() => !!this.storage.load().usuario);
  protected readonly metas = computed(() => this.metaService.gerarMetasSemanais());
}

