import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { NavBottomComponent } from './components/nav-bottom/nav-bottom.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, NavBottomComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  private readonly router = inject(Router);

  private readonly routeUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );

  protected readonly showHeader = computed(() => {
    const url = this.routeUrl() ?? '/';
    return !url.startsWith('/inicio');
  });

  protected readonly useContainer = computed(() => {
    const url = this.routeUrl() ?? '/';
    return !url.startsWith('/inicio');
  });

  protected readonly showNav = computed(() => {
    const url = this.routeUrl() ?? '/';
    return !url.startsWith('/inicio') && !url.startsWith('/cadastro');
  });
}
