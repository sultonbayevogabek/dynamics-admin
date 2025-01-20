import { Routes } from '@angular/router';

export const cabinetRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./cabinet.component').then(c => c.CabinetComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent),
        title: 'Bosh sahifa'
      },
      {
        path: 'my-tasks',
        loadChildren: () => import('./my-tasks/my-tasks.routes').then(c => c.myTasksRoutes),
        title: 'Mening topshiriqlarim'
      },
      {
        path: 'members',
        loadComponent: () => import('./members/members.component').then(c => c.MembersComponent),
        title: 'A\'zolar'
      },
      {
        path: 'profile',
        loadComponent: () => import('./profile/profile.component').then(c => c.ProfileComponent),
        title: 'Profil'
      },
      {
        path: 'notifications',
        loadComponent: () => import('./notifications/notifications.component').then(c => c.NotificationsComponent),
        title: 'Bildirishnomalar'
      },
      {
        path: 'admin-settings',
        loadChildren: () => import('./admin-settings/admin-settings.routes').then(c => c.adminSettingsRoutes),
        title: 'Admin sozlamalari'
      },
    ]
  },
];
