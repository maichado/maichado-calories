import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RefeicaoFormComponent } from '../../components/refeicao-form/refeicao-form.component';
import { InViewAnimateDirective } from '../../shared/directives/in-view-animate.directive';

@Component({
  selector: 'app-registrar-page',
  standalone: true,
  imports: [RefeicaoFormComponent, InViewAnimateDirective],
  template: `
    <section class="mc-grid" appInViewAnimate>
      <div class="mc-card">
        <div class="mc-card__inner">
          <h1 class="mc-title registrar__title">Registrar refeição do dia</h1>
          <p class="mc-subtitle">
            Escolha a refeição, descreva o que você comeu e calcule as calorias com IA em segundos.
          </p>
        </div>
      </div>

      <app-refeicao-form />
    </section>
  `,
  styles: [`
    .registrar__title{font-size:24px}
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrarPage {}

