import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

const PAGE_LABELS: Record<string, string> = {
  inicio: '',
  dashboard: 'Dashboard',
  registrar: 'Registrar',
  peso: 'Peso',
  metas: 'Metas',
  historico: 'Histórico',
  perfil: 'Perfil'
};

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="mc-header">
      <div class="mc-header__inner">
        <a class="mc-header__brand" routerLink="/inicio" aria-label="Vivae">
          <img class="mc-header__logo" src="/vivae-logo.png" alt="Vivae" />
        </a>
        @if (pageTitle()) {
          <span class="mc-header__page">{{ pageTitle() }}</span>
        }
      </div>
    </header>
  `,
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  private readonly router = inject(Router);

  private readonly routeUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );

  protected readonly pageTitle = computed(() => {
    const url = this.routeUrl() ?? '/';
    let path = url;
    try { path = new URL(url, 'http://local').pathname; } catch { /* noop */ }
    const seg = path.split('?')[0].split('/').filter(Boolean)[0] ?? 'inicio';
    return PAGE_LABELS[seg] ?? '';
  });
}
