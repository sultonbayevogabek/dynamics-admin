import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToasterComponent } from '../components/toaster/toaster.component';

@Injectable({
  providedIn: 'root'
})

export class ToasterService {
  private _snackbar: MatSnackBar = inject(MatSnackBar);

  open({
         type = 'success',
         title,
         message,
         dismissible = true,
         duration = 5000
       }: {
    type?: 'success' | 'warning' | 'info' | 'error';
    title?: string;
    message: string;
    dismissible?: boolean;
    duration?: 1000 | 2000 | 5000 | 10000 | 15000 | 20000 | 25000;
  }): void {
    const config: any = {
      data: {
        type,
        title,
        message,
        dismissible,
        duration
      },
      verticalPosition: 'top',
      horizontalPosition: 'right'
    };

    if (dismissible) {
      config.duration = duration;
    }

    this._snackbar.openFromComponent(ToasterComponent, config);
  }
}
