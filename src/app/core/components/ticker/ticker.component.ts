import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ticker',
  standalone: true,
  imports: [
    TranslateModule
  ],
  templateUrl: './ticker.component.html'
})

export class TickerComponent {}
