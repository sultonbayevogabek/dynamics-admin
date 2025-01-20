import { Routes } from '@angular/router';

export const adminSettingsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-settings.component').then(c => c.AdminSettingsComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'departments',
      },
      {
        path: 'departments',
        loadComponent: () => import('./departments/departments.component').then(c => c.DepartmentsComponent),
      },
      {
        path: 'positions',
        loadComponent: () => import('./positions/positions.component').then(c => c.PositionsComponent),
      }
    ]
  },
];
