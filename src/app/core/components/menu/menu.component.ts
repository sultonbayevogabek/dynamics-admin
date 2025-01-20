import { Component, OnInit, Renderer2 } from '@angular/core';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MatRipple } from '@angular/material/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ScrollbarDirective } from '../../../config/directives/scrollbar.directive';
import { MatTooltip } from '@angular/material/tooltip';
import { HasPermissionsDirective } from '../../directives/has-permissions.directive';

@Component({
  selector: 'side-menu',
  standalone: true,
  imports: [
    NgOptimizedImage,
    MatIcon,
    TranslateModule,
    NgClass,
    MatRipple,
    RouterLink,
    RouterLinkActive,
    ScrollbarDirective,
    MatTooltip,
    HasPermissionsDirective
  ],
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {
  menu = [
    {
      icon: 'icon:dashboard',
      text: 'dashboard',
      link: 'dashboard',
      tooltipText: ''
    },
    {
      icon: 'icon:book',
      text: 'my.tasks',
      link: 'my-tasks',
      tooltipText: ''
    },
    {
      icon: 'icon:members',
      text: 'members',
      link: 'members',
      tooltipText: ''
    }
  ];
  mode = 'light';

  constructor(
    private renderer: Renderer2
  ) {
  }

  ngOnInit(): void {
    this.setTheme(localStorage.getItem('theme'));
  }

  setTheme(theme: string | undefined = 'light'): void {
    localStorage.setItem('theme', theme);
    const htmlRootElement = this.renderer.selectRootElement('html', true);
    if (theme === 'dark') {
      htmlRootElement.classList.add('dark');
    } else {
      htmlRootElement.classList.remove('dark');
    }
  }
}
