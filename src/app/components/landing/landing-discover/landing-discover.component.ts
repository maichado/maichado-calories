import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InViewAnimateDirective } from '../../../shared/directives/in-view-animate.directive';

@Component({
  selector: 'app-landing-discover',
  standalone: true,
  imports: [InViewAnimateDirective],
  template: `
    <section class="discover" id="funcionalidades" appInViewAnimate>
      <h2>Descubra o Vivae</h2>
      <div class="discover__grid">
        <article class="discover__card">
          <div class="discover__icon">🍴</div>
          <h3>Registre suas refeições</h3>
          <p>Descreva o que comeu em texto livre e nossa IA calcula as calorias automaticamente.</p>
        </article>
        <article class="discover__card">
          <div class="discover__icon">📈</div>
          <h3>Acompanhe seu progresso</h3>
          <p>Veja sua evolução de peso, déficit calórico e metas semanais em tempo real.</p>
        </article>
        <article class="discover__card">
          <div class="discover__icon">🏆</div>
          <h3>Bata suas metas</h3>
          <p>Metas semanais automáticas com base no seu peso e objetivo final.</p>
        </article>
      </div>
    </section>
  `,
  styles: [`
    .discover{max-width:1120px;margin:0 auto;padding:26px var(--mc-space-4)}
    .discover h2{margin:0;text-align:center;font-size:clamp(26px,4vw,36px);letter-spacing:-.6px}
    .discover__grid{margin-top:22px;display:grid;gap:14px}
    .discover__card{border:1px solid var(--mc-border-2);border-radius:18px;padding:18px;background:#fff;box-shadow:var(--mc-shadow-sm)}
    .discover__icon{font-size:30px}
    .discover__card h3{margin:10px 0 0;font-size:18px}
    .discover__card p{margin:8px 0 0;color:var(--mc-text-2);line-height:1.5}
    @media(min-width:900px){.discover{padding-inline:var(--mc-space-6)}.discover__grid{grid-template-columns:repeat(3,1fr)}}
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingDiscoverComponent {}

