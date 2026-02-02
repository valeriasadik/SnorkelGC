import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'discover',
    loadComponent: () => import('./discover/home.page').then(m => m.HomePage)
  },
  {
    path: '',
    redirectTo: 'discover',
    pathMatch: 'full'
  }
];
