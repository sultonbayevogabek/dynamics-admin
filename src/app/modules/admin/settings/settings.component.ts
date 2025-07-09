import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatTabLink, MatTabNav } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'admin-settings',
  imports: [
    MatTabNav,
    MatTabLink,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatButton
  ],
  templateUrl: './settings.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
