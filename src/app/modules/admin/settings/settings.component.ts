import { Component } from '@angular/core';
import { MatTabLink, MatTabNav } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'settings',
  imports: [
    MatTabNav,
    MatTabLink,
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  templateUrl: './settings.component.html'
})

export class Settings {
  menu = [
    {
      title: 'Buyurtma statuslari',
      url: 'order-statuses'
    },
    {
      title: 'Mijozlar',
      url: 'clients'
    }
  ]
}
