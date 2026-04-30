import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InViewAnimateDirective } from '../../../shared/directives/in-view-animate.directive';

@Component({
  selector: 'app-landing-hero',
  standalone: true,
  imports: [RouterLink, InViewAnimateDirective],
  template: `
    <section class="hero" id="topo" appInViewAnimate>
      <div class="hero__content">
        <h1>Transforme sua alimentação.<br />Alcance seu peso ideal.</h1>
        <p>
          Registre o que você come, acompanhe suas calorias e monitore seu progresso — tudo pelo
          navegador, sem baixar nada.
        </p>
        <div class="hero__actions">
          <a class="mc-btn mc-btn--primary" [routerLink]="'/cadastro'">Começar agora — é grátis</a>
          <a class="mc-btn mc-btn--outline" href="#funcionalidades">Ver como funciona</a>
        </div>
        <div class="hero__badges">
          <span class="mc-chip">100% gratuito</span>
          <span class="mc-chip">Sem download necessário</span>
          <span class="mc-chip">Powered by IA</span>
        </div>
      </div>

      <div style="width: 400px;" aria-label="Imagem de comida Vivae">
        <img class="hero__food-image" src="/comida-vivae.png" alt="Prato de comida saudável da Vivae" />
      </div>
    </section>
  `,
  styles: [`
    .hero{max-width:1120px;margin:0 auto;padding:56px var(--mc-space-4) 30px;display:grid;gap:28px}
    .hero h1{margin:0;font-size:clamp(34px,5vw,54px);line-height:1.08;letter-spacing:-1px;color:var(--mc-text)}
    .hero p{margin:16px 0 0;font-size:18px;color:var(--mc-text-2);max-width:640px;line-height:1.5}
    .hero__actions{margin-top:22px;display:flex;gap:12px;flex-wrap:wrap}
    .hero__actions .mc-btn{border-radius:24px;padding-inline:20px}
    .hero__badges{margin-top:18px;display:flex;gap:8px;flex-wrap:wrap}
    .hero__mockup{border:1px solid var(--mc-border-2);border-radius:22px;padding:12px;background:#f4fbf7}
    .hero__food-image{display:block;width:100%;height:100%;max-height:420px;object-fit:cover;border-radius:16px}
    @media(min-width:1024px){.hero{grid-template-columns:1fr 1fr;align-items:center;padding-inline:var(--mc-space-6)}}
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingHeroComponent {}

