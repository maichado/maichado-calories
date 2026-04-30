import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InViewAnimateDirective } from '../../../shared/directives/in-view-animate.directive';

@Component({
  selector: 'app-landing-testimonials',
  standalone: true,
  imports: [InViewAnimateDirective],
  template: `
    <section class="testimonials" appInViewAnimate>
      <h2>Histórias reais</h2>
      <div class="testimonials__grid">
        <article>
          <div class="avatar">AL</div>
          <h3>Ana Lima · Curitiba</h3>
          <p>Perdi 9kg em 4 meses com rotina simples. O app me ajudou a enxergar meus hábitos.</p>
        </article>
        <article>
          <div class="avatar">RC</div>
          <h3>Rafael Costa · Recife</h3>
          <p>Registrar no navegador ficou muito mais fácil. O cálculo automático da IA economiza tempo.</p>
        </article>
        <article>
          <div class="avatar">MP</div>
          <h3>Marina Paes · São Paulo</h3>
          <p>As metas semanais me deixaram consistente. Hoje sei exatamente como ajustar minha alimentação.</p>
        </article>
      </div>
    </section>
  `,
  styles: [`
    .testimonials{max-width:1120px;margin:0 auto;padding:30px var(--mc-space-4)}
    .testimonials h2{margin:0;text-align:center;font-size:clamp(24px,4vw,34px)}
    .testimonials__grid{margin-top:20px;display:grid;gap:12px}
    .testimonials article{border:1px solid var(--mc-border-2);border-radius:16px;padding:16px;background:#fff}
    .avatar{width:40px;height:40px;border-radius:999px;display:grid;place-items:center;background:#dff6e8;color:#1a6b3c;font-weight:800}
    .testimonials h3{margin:12px 0 0;font-size:15px}
    .testimonials p{margin:8px 0 0;color:var(--mc-text-2);line-height:1.5}
    @media(min-width:900px){.testimonials{padding-inline:var(--mc-space-6)}.testimonials__grid{grid-template-columns:repeat(3,1fr)}}
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingTestimonialsComponent {}

