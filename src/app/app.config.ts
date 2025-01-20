import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideIcons } from './config/icons/icons.provider';
import { HttpClient, HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { loggingInterceptor } from './core/interceptors/logging.interceptor';
import { languageInterceptor } from './core/interceptors/language.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import localeRu from '@angular/common/locales/ru';
import { registerLocaleData } from '@angular/common';
import { httpConfigInterceptor } from './core/interceptors/http-config.interceptor';
import { provideEnvironmentNgxMask } from 'ngx-mask';

registerLocaleData(localeRu);

function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

const I18N_CONFIG = {
  defaultLanguage: localStorage.getItem('lang') ? localStorage.getItem('lang'): 'uz_latn',
  loader: {
    provide: TranslateLoader,
    useFactory: HttpLoaderFactory,
    deps: [ HttpClient ]
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideEnvironmentNgxMask(),
    provideIcons(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        loggingInterceptor,
        languageInterceptor,
        errorInterceptor,
        httpConfigInterceptor,
      ])
    ),
    importProvidersFrom(
      HttpClientModule,
      TranslateModule.forRoot(I18N_CONFIG)
    ),
  ]
};
