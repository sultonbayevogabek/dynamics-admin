import { Component, Injector } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
  imports: [ RouterOutlet ]
})

export class AppComponent {
  static injector: Injector;
  constructor(
    injector: Injector
  ) {
    AppComponent.injector = injector;
  }

  method<T>(response: T): T {
    return response;
  }

  some() {
    this.method<string>('some');
  }
}
