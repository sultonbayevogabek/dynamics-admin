import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, firstValueFrom, map, Observable, of, switchMap } from 'rxjs';
import { RequestService } from '../../shared/services/request.service';
import { environment } from '../../../environments/environment';
import { IUser } from '../../shared/interfaces/user.interface';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService extends RequestService {
  currentUser$ = new BehaviorSubject<IUser | null>(null);
  private _authorized = false;
  private router = inject(Router);
  private snackbar = inject(MatSnackBar);

  constructor(
    http: HttpClient
  ) {
    super(http);
    (window as any).receiveData = this.receiveData.bind(this);
  }

  set token(token: string) {
    if (!token) return;
    localStorage.setItem('token', token);
  }

  get token(): string {
    return localStorage.getItem('token') ?? '';
  }

  set authorized(auth: boolean) {
    this._authorized = auth;
  }

  get authorized(): boolean {
    return this._authorized;
  }

  openOAuthWindow(): void {
    const dimensions = this.getOAuthWindowDimensions();
    const oauthUrl = this.getOAuthUrl();

    window.open(
      oauthUrl,
      '_blank',
      this.formatWindowOptions(dimensions)
    );
  }

  private getOAuthWindowDimensions(): { width: number; height: number; left: number; top: number } {
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    const dimensions = {
      width: 840,
      height: 500
    };

    if (screenWidth < 768) {
      dimensions.width = screenWidth;
      dimensions.height = screenHeight;
    } else if (screenWidth < 1024) {
      dimensions.width = screenWidth * 0.7;
      dimensions.height = screenHeight * 0.7;
    }

    return {
      ...dimensions,
      left: (screenWidth - dimensions.width) / 2,
      top: (screenHeight - dimensions.height) / 2
    };
  }

  private getOAuthUrl(): string {
    return `https://accounts.google.com/o/oauth2/v2/auth?${ new URLSearchParams(environment.googleAuthParams) }`;
  }

  private formatWindowOptions(dimensions: { width: number; height: number; left: number; top: number }): string {
    return Object.entries(dimensions)
      .map(([ key, value ]) => `${ key }=${ Math.round(value) }`)
      .join(',');
  }

  authWithGoogle(idToken: string): Observable<{ token: string }> {
    return this.request<{ token: string }>('auth/google', { idToken });
  }

  async receiveData(data: { success: boolean; token: string }) {
    if (!data?.success) {
      this.snackbar.open('Avtorizatsiyada xatolik kelib chiqdi');
      return;
    }

    this.token = data.token;
    await firstValueFrom(this.getUserWithToken());
    await this.router.navigate([ '/' ]);
  }

  getUserWithToken(): Observable<IUser | unknown> {
    if (!this.token) {
      this.authorized = false;
      this.currentUser$.next(null);
      return of(null);
    }

    if (this.authorized) {
      return of(this.currentUser$.value);
    }

    return this.request<IUser>('user/get-user-by-token', {}).pipe(
      switchMap(user => {
        if ([ 'admin', 'superAdmin' ].includes(user.role)) {
          this.authorized = true;
          this.currentUser$.next(user);
          return of(user);
        }
        this.authorized = false;
        this.currentUser$.next(null);
        return of(null);
      }),
      catchError(() => {
        this.authorized = false;
        this.currentUser$.next(null);
        return of(null);
      })
    );
  }

  isAuthorized(): Observable<boolean> {
    return !this.token ? of(false) : this.getUserWithToken().pipe(
      map((user: IUser) => {
        return user && [ 'admin', 'superAdmin' ].includes(user?.role);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.authorized = false;
    this.currentUser$.next(null);
    this.router.navigate([ '/sign-in' ]);
  }
}
