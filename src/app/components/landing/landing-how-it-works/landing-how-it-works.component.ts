import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InViewAnimateDirective } from '../../../shared/directives/in-view-animate.directive';

@Component({
  selector: 'app-landing-how-it-works',
  standalone: true,
  imports: [RouterLink, InViewAnimateDirective],
  template: `
    <section class="how" id="como-funciona" appInViewAnimate>
      <h2>Como o Vivae funciona</h2>
      <div class="how__steps">
        <article><span>1</span><h3>Crie seu perfil</h3><p>Informe seu peso atual, meta e data desejada.</p></article>
        <article><span>2</span><h3>Registre suas refeições</h3><p>Descreva o que comeu e a IA calcula as calorias.</p></article>
        <article><span>3</span><h3>Atualize seu peso</h3><p>Registre seu peso e acompanhe sua evolução.</p></article>
        <article><span>4</span><h3>Alcance sua meta</h3><p>Acompanhe metas semanais e celebre conquistas.</p></article>
      </div>
      <a class="mc-btn mc-btn--primary how__cta" [routerLink]="'/cadastro'">Criar minha conta grátis</a>
    </section>
  `,
  styles: [`
    .how{max-width:1120px;margin:0 auto;padding:36px var(--mc-space-4);text-align:center}
    .how h2{margin:0;font-size:clamp(26px,4vw,36px);letter-spacing:-.6px}
    .how__steps{margin-top:22px;display:grid;gap:12px}
    .how__steps article{background:#fff;border:1px solid var(--mc-border-2);border-radius:16px;padding:16px;text-align:left}
    .how__steps span{width:28px;height:28px;border-radius:999px;display:inline-grid;place-items:center;background:var(--mc-green-bg);color:var(--mc-green);font-weight:800}
    .how__steps h3{margin:10px 0 0;font-size:16px}
    .how__steps p{margin:6px 0 0;color:var(--mc-text-2)}
    .how__cta{margin-top:18px;border-radius:24px}
    @media(min-width:900px){.how{padding-inline:var(--mc-space-6)}.how__steps{grid-template-columns:repeat(4,1fr)}}
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingHowItWorksComponent {}

