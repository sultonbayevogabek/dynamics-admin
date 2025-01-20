import { ENVIRONMENT_INITIALIZER, EnvironmentProviders, inject, Provider } from '@angular/core';
import { IconsService } from './icons.service';

export const provideIcons = (): Array<Provider | EnvironmentProviders> => [
  {
    provide: ENVIRONMENT_INITIALIZER,
    useValue: () => inject(IconsService),
    multi: true
  }
];
