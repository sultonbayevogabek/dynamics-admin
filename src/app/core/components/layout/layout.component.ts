import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewEncapsulation } from '@angular/core';
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav';
import { MatButton } from '@angular/material/button';
import { MenuComponent } from '../menu/menu.component';
import { HeaderComponent } from '../header/header.component';
import { RouterOutlet } from '@angular/router';
import { TickerComponent } from '../ticker/ticker.component';

@Component({
  selector: 'layout',
  standalone: true,
  imports: [
    MatDrawerContainer,
    MatDrawer,
    MatButton,
    MenuComponent,
    MatDrawerContent,
    HeaderComponent,
    RouterOutlet,
    TickerComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None
})

export class LayoutComponent {
}
