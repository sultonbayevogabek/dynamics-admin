import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export function languageInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const currentLang = localStorage.getItem('lang') || 'uz';

  const requestWithLanguage = req.clone({
    headers: req.headers.append('Accept-Language', currentLang)
  });

  return next(requestWithLanguage);
}
