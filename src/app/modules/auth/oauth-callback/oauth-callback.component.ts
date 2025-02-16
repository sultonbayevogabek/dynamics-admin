import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'oauth-callback',
  templateUrl: './oauth-callback.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    MatProgressSpinnerModule,
  ]
})

export class OAuthCallbackComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {
  }

  async ngOnInit() {
    await this.authWithGoogle();
  }

  async authWithGoogle(): Promise<void> {
    if (!this.idToken) {
      this.onAuthFailed();
      return;
    }

    const response = await firstValueFrom(this.authService.authWithGoogle(this.idToken));

    if (!response || !response.token) {
      this.onAuthFailed();
      return;
    }

    this.onAuthSucceed(response.token);
  }

  onAuthFailed() {
    window.opener.receiveData({
      success: false
    });
    window.close();
  }

  onAuthSucceed(token: string) {
    window.opener.receiveData({
      success: true,
      token
    });
    window.close();
  }

  get idToken(): string | null {
    const fragment = this.activatedRoute.snapshot.fragment;

    if (!fragment) {
      return null;
    }

    const match = fragment.match(/id_token=([^&]+)/);
    return match ? match[1]?.replace('id_token=', '') : null;
  }
}
