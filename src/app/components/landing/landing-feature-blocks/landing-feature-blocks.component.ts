import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InViewAnimateDirective } from '../../../shared/directives/in-view-animate.directive';

@Component({
  selector: 'app-landing-feature-blocks',
  standalone: true,
  imports: [InViewAnimateDirective],
  template: `
    <section class="blocks" appInViewAnimate>
      <article class="blocks__item">
        <div class="blocks__media"></div>
        <div class="blocks__text">
          <h3>Dashboard inteligente</h3>
          <p>Visualize calorias diárias, refeições separadas e déficit calórico em tempo real.</p>
        </div>
      </article>
      <article class="blocks__item blocks__item--reverse">
        <div class="blocks__media"></div>
        <div class="blocks__text">
          <h3>Inteligência Artificial integrada</h3>
          <p>Descreva sua refeição em linguagem natural e a IA calcula calorias automaticamente.</p>
        </div>
      </article>
      <article class="blocks__item">
        <div class="blocks__media"></div>
        <div class="blocks__text">
          <h3>Controle de peso com metas</h3>
          <p>Defina seu peso meta e data desejada. O sistema gera metas semanais automáticas.</p>
        </div>
      </article>
    </section>
  `,
  styles: [`
    .blocks{max-width:1120px;margin:0 auto;padding:40px var(--mc-space-4);display:grid;gap:18px}
    .blocks__item{display:grid;gap:14px;background:#fff;border:1px solid var(--mc-border-2);border-radius:18px;overflow:hidden}
    .blocks__media{min-height:180px;background:linear-gradient(135deg,#dff8e9,#eff7f3)}
    .blocks__text{padding:16px}
    .blocks__text h3{margin:0;font-size:22px;letter-spacing:-.5px}
    .blocks__text p{margin:10px 0 0;color:var(--mc-text-2);line-height:1.5}
    @media(min-width:900px){.blocks{padding-inline:var(--mc-space-6)}.blocks__item{grid-template-columns:1fr 1fr}.blocks__item--reverse .blocks__media{order:2}}
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingFeatureBlocksComponent {}

