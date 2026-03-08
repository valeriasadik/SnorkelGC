import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'welcome',
    loadComponent: () =>
      import('./pages/welcome/welcome.page').then((m) => m.WelcomePage),
  },
  {
    path: 'discover',
    loadComponent: () =>
      import('./pages/discover/home.page').then((m) => m.HomePage),
  },
  {
    path: 'spot-detail/:id',
    loadComponent: () =>
      import('./pages/spot-detail/spot-detail.page').then(
        (m) => m.SpotDetailPage,
      ),
  },
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },
];
