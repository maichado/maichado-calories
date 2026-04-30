import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InViewAnimateDirective } from '../../../shared/directives/in-view-animate.directive';

@Component({
  selector: 'app-landing-impact-metrics',
  standalone: true,
  imports: [InViewAnimateDirective],
  template: `
    <section class="impact" id="resultados" appInViewAnimate>
      <div class="impact__inner">
        <article><h3>1.5kg</h3><p>por semana de perda média</p></article>
        <article><h3>0</h3><p>downloads necessários</p></article>
        <article><h3>100%</h3><p>gratuito</p></article>
        <article><h3>IA</h3><p>integrada para calorias</p></article>
      </div>
    </section>
  `,
  styles: [`
    .impact{background:#1a6b3c;color:#fff}
    .impact__inner{max-width:1120px;margin:0 auto;padding:28px var(--mc-space-4);display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
    .impact article{text-align:center}
    .impact h3{margin:0;font-size:36px;letter-spacing:-.8px}
    .impact p{margin:6px 0 0;font-size:13px;opacity:.95}
    @media(min-width:900px){.impact__inner{padding-inline:var(--mc-space-6);grid-template-columns:repeat(4,1fr)}}
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingImpactMetricsComponent {}

