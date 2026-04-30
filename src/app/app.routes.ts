import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  {
    path: 'inicio',
    loadComponent: () => import('./pages/inicio/inicio.page').then((m) => m.InicioPage)
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./pages/cadastro/cadastro.page').then((m) => m.CadastroPage)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage)
  },
  {
    path: 'registrar',
    loadComponent: () =>
      import('./pages/registrar/registrar.page').then((m) => m.RegistrarPage)
  },
  {
    path: 'peso',
    loadComponent: () => import('./pages/peso/peso.page').then((m) => m.PesoPage)
  },
  {
    path: 'metas',
    loadComponent: () => import('./pages/metas/metas.page').then((m) => m.MetasPage)
  },
  {
    path: 'historico',
    loadComponent: () =>
      import('./pages/historico/historico.page').then((m) => m.HistoricoPage)
  },
  {
    path: 'perfil',
    loadComponent: () =>
      import('./pages/perfil/perfil.page').then((m) => m.PerfilPage)
  },
  { path: '**', redirectTo: 'inicio' }
];
