import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { UserModel } from '../models/user.model';
import { BehaviorSubject, catchError, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private _httpClient = inject(HttpClient);
  private _router = inject(Router);

  private _currentUser: UserModel;
  private _token: string;

  public currentUser$: BehaviorSubject<UserModel> = new BehaviorSubject<UserModel>(null);

  get token(): string {
    return this._token || localStorage.getItem('access_token') || '';
  }

  set token(value: string) {
    localStorage.setItem('access_token', value);
    this._token = value;
  }

  get currentUser(): UserModel {
    return this._currentUser;
  }

  set currentUser(value) {
    this._currentUser = value;
  }

  getUserListByOneIdCode(code: string) {
    this._httpClient.post(environment.host + 'auth/user-list-by-one-id-code', { code: code })
      .subscribe({
        next: (res: any) => {
          if (!res?.users?.length) {
            return;
          }

          this.token = res?.users[0]?.token?.access_token;
          this.getUserByToken().subscribe({
            next: () => {
              this._router.navigate(['/']).then();
            }
          });
        }
      });
  }

  getUserByToken(): Observable<UserModel> {
    if (this._currentUser) {
      return of(this.currentUser);
    }

    if (!this.token) {
      this._router.navigate([ '/auth' ]).then();
      return of(null);
    }

    return this._httpClient.post<UserModel>(environment.host + 'auth/get-user', {
      access_token: this.token
    })
      .pipe(
        switchMap((user: UserModel) => {
          this.currentUser = user;
          this.currentUser$.next(user);
          return of(user);
        }),
        catchError(() => {
          this.currentUser$.next(null);
          return of(null);
        })
      );
  }

  signOut(): void {
    this.currentUser = null;
    this.currentUser$.next(null);
    localStorage.removeItem('access_token');
    this._router.navigate([ '/auth' ]).then();
  }
}
