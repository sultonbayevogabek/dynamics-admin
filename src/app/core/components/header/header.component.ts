import { Component, DestroyRef, inject, Injectable, OnInit } from '@angular/core';
import { NgClass, NgOptimizedImage, TitleCasePipe } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { OverlayComponent } from '../overlay-panel/overlay-panel.component';
import { MatRipple } from '@angular/material/core';
import { AuthService } from '../../services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserModel } from '../../models/user.model';
import { RouterLink } from '@angular/router';
import { NotificationsService } from '../../services/notifications.service';
import { TickerComponent } from '../ticker/ticker.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'site-header',
  standalone: true,
  imports: [
    NgOptimizedImage,
    TranslateModule,
    MatIcon,
    OverlayComponent,
    MatRipple,
    NgClass,
    TitleCasePipe,
    RouterLink,
    TickerComponent
  ],
  templateUrl: './header.component.html',
})

@Injectable({
  providedIn: 'root'
})

export class HeaderComponent implements OnInit {
  currentLang = 'uz_latn';
  currentUser: UserModel;
  notificationsCount = 0;
  fileHost = environment.fileHost;
  languages = [
    {
      id: 'uz_latn',
      text: 'O\'zbek'
    },
    {
      id: 'uz',
      text: 'Ўзбек'
    },
    {
      id: 'ru',
      text: 'Русский'
    },
    {
      id: 'en',
      text: 'English'
    }
  ]
  private _translateService = inject(TranslateService);
  private _authService = inject(AuthService);
  private _destroyRef = inject(DestroyRef);
  private _notificationsService = inject(NotificationsService);

  ngOnInit(): void {
    this.currentLang = this._translateService.defaultLang;

    this._authService.currentUser$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: user => this.currentUser = user
      })

    this._notificationsService.getNotificationsCount()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();

    this._notificationsService.notificationsCount$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(count => {
        this.notificationsCount = count;
      });
  }

  changeLanguage(id: string): void {
    localStorage.setItem('lang', id);
    window.location.reload();
  }

  logout() {
    this._authService.signOut();
  }
}
