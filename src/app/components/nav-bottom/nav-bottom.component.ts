import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

type NavItem = {
  label: string;
  route: string;
  emoji: string;
};

@Component({
  selector: 'app-nav-bottom',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="mc-nav" aria-label="Navegação principal">
      @for (item of items; track item.route) {
        <a
          class="mc-nav__item"
          [routerLink]="item.route"
          routerLinkActive="is-active"
          [routerLinkActiveOptions]="{ exact: false }"
        >
          <span class="mc-nav__icon" aria-hidden="true">{{ item.emoji }}</span>
          <span class="mc-nav__label">{{ item.label }}</span>
        </a>
      }
    </nav>
  `,
  styleUrl: './nav-bottom.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavBottomComponent {
  protected readonly items: NavItem[] = [
    { label: 'Hoje', route: '/dashboard', emoji: '🏠' },
    { label: 'Registrar', route: '/registrar', emoji: '✏️' },
    { label: 'Peso', route: '/peso', emoji: '⚖️' },
    { label: 'Metas', route: '/metas', emoji: '🎯' },
    { label: 'Perfil', route: '/perfil', emoji: '👤' }
  ];
}
