import { Routes } from '@angular/router';

export const myTasksRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./my-tasks.component').then(c => c.MyTasksComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'objectives',
      },
      {
        path: 'objectives',
        loadComponent: () => import('./tasks-board/tasks-board.component').then(c => c.TasksBoardComponent),
        title: 'Mening topshiriqlarim | Maqsadlar'
      },
      {
        path: 'key-results',
        loadComponent: () => import('./key-results-board/key-results-board.component').then(c => c.KeyResultsBoardComponent),
        title: 'Mening topshiriqlarim | Asosiy vazifalar'
      }
    ]
  },
];
