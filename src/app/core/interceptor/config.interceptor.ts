import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export const configInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {

  const clonedReq = req.clone({
    setHeaders: {
      'App-Type': 'admin'
    }
  });

  return next(clonedReq);
};
