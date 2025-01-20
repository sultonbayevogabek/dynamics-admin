import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);

  let requestWithToken = req.clone();

  if (authService.token) {
    requestWithToken = requestWithToken.clone({
      headers: req.headers.append('Authorization', 'Bearer ' + authService.token)
    })
  }

  return next(requestWithToken);
}
