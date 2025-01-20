import { Component } from '@angular/core';
import { LayoutComponent } from '../core/components/layout/layout.component';

@Component({
  selector: 'cabinet',
  standalone: true,
  imports: [
    LayoutComponent
  ],
  templateUrl: './cabinet.component.html'
})

export class CabinetComponent {
}
