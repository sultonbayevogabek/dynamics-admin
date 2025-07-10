import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';

@Component({
  selector: 'admin-settings',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatButtonToggleGroup,
    MatButtonToggle
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
