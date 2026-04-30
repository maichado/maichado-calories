import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="landing-header">
      <div class="landing-header__inner">
        <a class="landing-header__brand" href="#topo" aria-label="Vivae">
          <img class="landing-header__logo" src="/vivae-logo.png" alt="Vivae" />
        </a>

        <nav class="landing-header__menu" [class.is-open]="menuOpen()" aria-label="Navegação da landing">
          <a href="#funcionalidades" (click)="closeMenu()">Funcionalidades</a>
          <a href="#como-funciona" (click)="closeMenu()">Como funciona</a>
          <a href="#resultados" (click)="closeMenu()">Resultados</a>
          <a [routerLink]="'/dashboard'" (click)="closeMenu()">Entrar</a>
          <a class="mc-btn mc-btn--primary landing-header__ctaMobile" [routerLink]="'/cadastro'" (click)="closeMenu()">
            Começar grátis
          </a>
        </nav>

        <a class="mc-btn mc-btn--primary landing-header__cta" [routerLink]="'/cadastro'">Começar grátis</a>

        <button class="landing-header__toggle" type="button" (click)="menuOpen.set(!menuOpen())" aria-label="Abrir menu">
          ☰
        </button>
      </div>
    </header>
  `,
  styles: [`
    .landing-header { position: sticky; top: 0; z-index: 40; background: rgba(255,255,255,.96); }
    .landing-header__inner { width:100%; margin: 0; padding: 10px 28px; display:flex; align-items:center; justify-content:space-between; gap:14px; min-height: 64px; }
    .landing-header__brand { display:inline-flex; align-items:center; -webkit-tap-highlight-color:transparent; flex: 0 0 auto; }
    .landing-header__logo { width: 200px; height: 44px; display:block; object-fit:contain; }
    .landing-header__menu { display:none; align-items:center; gap:20px; color:var(--mc-text-2); font-weight:600; }
    .landing-header__menu a:hover { color: var(--mc-green); }
    .landing-header__ctaMobile { display:none; }
    .landing-header__toggle { display:inline-flex; border:1px solid var(--mc-border-2); background:#fff; border-radius:10px; width:36px; height:36px; align-items:center; justify-content:center; }
    .landing-header__cta { display:none; border-radius:24px; }
    @media (max-width: 899px) {
      .landing-header__inner { padding: 10px 16px; min-height: 60px; }
      .landing-header__logo { width: 170px; height: 40px; }
      .landing-header__menu.is-open { display:grid; position:absolute; top:62px; left:12px; right:12px; background:#fff; border:1px solid var(--mc-border-2); border-radius:16px; padding:14px; gap:12px; box-shadow: var(--mc-shadow-md); }
      .landing-header__ctaMobile { display:inline-flex; }
    }
    @media (min-width: 900px) {
      .landing-header__inner { padding: 12px 44px; min-height: 68px; }
      .landing-header__toggle { display:none; }
      .landing-header__menu, .landing-header__cta { display:inline-flex; }
      .landing-header__menu { flex: 1 1 auto; justify-content: center; }
      .landing-header__cta { margin-left: 0; flex: 0 0 auto; border-radius: 24px; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingHeaderComponent {
  protected readonly menuOpen = signal(false);
  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}

