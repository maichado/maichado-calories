import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="landing-footer">
      <div class="landing-footer__inner">
        <div class="landing-footer__brand">
          <img class="logo" src="/vivae-logo.png" alt="Vivae" />
          <div>
            <p>Seu assistente inteligente de emagrecimento.</p>
          </div>
        </div>

        <div>
          <h4>Sistema</h4>
          <a [routerLink]="'/dashboard'">Dashboard</a>
          <a [routerLink]="'/registrar'">Registrar refeição</a>
          <a [routerLink]="'/peso'">Controle de peso</a>
          <a [routerLink]="'/metas'">Minhas metas</a>
        </div>

        <div>
          <h4>Sobre</h4>
          <a href="#como-funciona">Como funciona</a>
          <a href="#funcionalidades">Funcionalidades</a>
          <a href="#">Privacidade</a>
        </div>

        <div>
          <h4>Contato</h4>
          <a href="mailto:contato@vivae.app">contato@vivae.app</a>
        </div>
      </div>
      <div class="landing-footer__copy">Copyright 2026 Vivae. Todos os direitos reservados.</div>
    </footer>
  `,
  styles: [`
    .landing-footer{background:#fff;border-top:1px solid var(--mc-border-2)}
    .landing-footer__inner{max-width:1120px;margin:0 auto;padding:28px var(--mc-space-4);display:grid;gap:16px}
    .landing-footer__brand{display:flex;flex-direction:column;gap:10px}
    .landing-footer .logo{width:190px;max-width:100%;height:auto;display:block;object-fit:contain}
    .landing-footer h3,.landing-footer h4{margin:0}
    .landing-footer p{margin:4px 0 0;color:var(--mc-text-2)}
    .landing-footer a{display:block;margin-top:8px;color:var(--mc-text-2)}
    .landing-footer__copy{border-top:1px solid var(--mc-border-2);text-align:center;font-size:12px;color:var(--mc-muted);padding:12px}
    @media(min-width:900px){
      .landing-footer__inner{padding-inline:var(--mc-space-6);grid-template-columns:1.2fr 1fr 1fr 1fr}
      .landing-footer__brand{align-items:flex-start}
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingFooterComponent {}

