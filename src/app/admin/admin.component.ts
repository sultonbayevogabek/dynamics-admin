import { Component } from '@angular/core';
import { LayoutComponent } from '../core/layout/layout.component';

@Component({
  selector: 'app-admin',
  imports: [
    LayoutComponent
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  standalone: true
})
export class AdminComponent {

}
