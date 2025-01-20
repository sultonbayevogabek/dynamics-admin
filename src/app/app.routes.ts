import { Routes } from '@angular/router';
import { initialDataResolver } from './core/resolvers/initial-data.resolver';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./cabinet/cabinet.routes').then(r => r.cabinetRoutes),
    resolve: { initialData: initialDataResolver },
    canActivate: [ authGuard ]
  },
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.component').then(c => c.AuthComponent),
    pathMatch: 'full',
    title: 'Tizimga kirish'
  },

  {
    path: 'translate',
    loadComponent: () => import('./translate/translate.component').then(c => c.TranslateComponent),
    pathMatch: 'full',
    title: 'Tarjimon'
  },
];
