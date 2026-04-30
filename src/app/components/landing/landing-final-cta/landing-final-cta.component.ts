import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InViewAnimateDirective } from '../../../shared/directives/in-view-animate.directive';

@Component({
  selector: 'app-landing-final-cta',
  standalone: true,
  imports: [RouterLink, InViewAnimateDirective],
  template: `
    <section class="final-cta" appInViewAnimate>
      <div class="final-cta__inner">
        <h2>Pronto para começar sua jornada?</h2>
        <p>Crie sua conta agora e comece a monitorar suas calorias hoje mesmo.</p>
        <a class="mc-btn mc-btn--primary" [routerLink]="'/cadastro'">Começar grátis agora</a>
        <small>Sem cartão de crédito. Sem download. 100% no navegador.</small>
      </div>
    </section>
  `,
  styles: [`
    .final-cta{background:linear-gradient(180deg,#e9f9f0,#fff);padding:36px var(--mc-space-4)}
    .final-cta__inner{max-width:920px;margin:0 auto;text-align:center}
    .final-cta h2{margin:0;font-size:clamp(28px,4.2vw,42px);letter-spacing:-.7px}
    .final-cta p{margin:10px 0 0;color:var(--mc-text-2);font-size:16px}
    .final-cta .mc-btn{margin-top:16px;border-radius:24px;padding-inline:24px}
    .final-cta small{margin-top:12px;display:block;color:var(--mc-muted)}
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingFinalCtaComponent {}

