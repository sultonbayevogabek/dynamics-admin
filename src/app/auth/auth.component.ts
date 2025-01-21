import { Component, inject } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  imports: [],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  standalone: true
})

export class AuthComponent {
  private authService = inject(AuthService);

  async authWithGoogle() {
  }
}
