import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Caliper',
    loadComponent: () => import('./features/audit/audit-page').then((m) => m.AuditPageComponent),
  },
  {
    path: 'compare',
    title: 'Caliper: compare',
    loadComponent: () =>
      import('./features/compare/compare-page').then((m) => m.ComparePageComponent),
  },
  {
    path: 'about',
    title: 'Caliper: thresholds',
    loadComponent: () => import('./features/about/about-page').then((m) => m.AboutPageComponent),
  },
  { path: '**', redirectTo: '' },
];
