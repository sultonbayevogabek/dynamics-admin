import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { Observable } from 'rxjs';

export const authInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);

  if (authService.token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${ authService.token }`
      }
    });
    return next(clonedReq);
  }

  return next(req)
};
