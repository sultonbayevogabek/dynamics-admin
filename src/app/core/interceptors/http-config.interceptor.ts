import { HttpEvent, HttpEventType, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { decode, encode } from 'msgpack-lite';

export function httpConfigInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  if (req.method !== 'POST') {
    return next(req);
  }

  if (req.url.includes('assets/i18n')) {
    return next(req);
  }

  let requestClone = req.clone({
    body: encode(req.body).buffer,
    responseType: 'arraybuffer' as 'json'
  });

  return next(requestClone).pipe(
    map((event: HttpEvent<any>): any => {
      if (event instanceof HttpResponse && event.status !== 500) {
        const body = decode(new Uint8Array(event.body));
        return event.clone({
          body: body,
        });
      }

      if (event.type !== HttpEventType.Response) {
        return event;
      }
    }),
  );
}
