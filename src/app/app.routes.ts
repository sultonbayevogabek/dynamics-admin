import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./admin/admin.routes').then(r => r.adminRoutes),
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.component').then(c => c.AuthComponent)
  }
];
