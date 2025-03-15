/* eslint-disable */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
import { firstValueFrom } from 'rxjs';
import { FuseConfirmationConfig, FuseConfirmationService } from '../../../@fuse/services/confirmation';
import { AppComponent } from '../../app.component';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function Confirmable(options?: FuseConfirmationConfig): any {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (target: Object, propertyKey: string, descriptor: PropertyDescriptor): any => {
    const originalMethod = descriptor?.value;
    const config: FuseConfirmationConfig = {
      title: 'Diqqat',
      message: 'Amalni tasdiqlaysizmi?',
      icon: {
        show: true,
        name: 'heroicons_outline:exclamation-triangle',
        color: 'warn'
      },
      actions: {
        confirm: {
          show: true,
          label: 'Tasdiqlash',
          color: 'primary'
        },
        cancel: {
          show: true,
          label: 'Bekor qilish'
        }
      },
      dismissible: true
    };

    if (options) {
      Object.keys(options).forEach((x) => (config[x] = options[x]));
    }

    descriptor.value = async function (...args): Promise<any> {
      const res: any = await firstValueFrom(
        AppComponent.injector.get(FuseConfirmationService).open(config).afterClosed()
      );
      if (res === 'confirmed') {
        return originalMethod.apply(this, args);
      }
    };
    return descriptor;
  };
}
