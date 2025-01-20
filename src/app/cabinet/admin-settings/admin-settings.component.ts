import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatRipple } from '@angular/material/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'admin-settings',
  standalone: true,
  imports: [
    TranslateModule,
    MatRipple,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgTemplateOutlet
  ],
  templateUrl: './admin-settings.component.html',
  providers: [
  ]
})

export class AdminSettingsComponent {
  tabs = [
    {
      link: 'departments',
      text: 'departments'
    },
    {
      link: 'positions',
      text: 'positions'
    },
  ];
}
