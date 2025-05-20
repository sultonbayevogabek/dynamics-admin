import { Routes } from '@angular/router';
import { Settings } from './settings.component';
import { OrderStatusesComponent } from './order-statuses/order-statuses.component';

export default [
  {
    path: '',
    component: Settings,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'order-statuses'
      },
      {
        path: 'order-statuses',
        component: OrderStatusesComponent
      }
    ]
  }
] as Routes
