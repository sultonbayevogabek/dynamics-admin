import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../components/confirmation/confirmation.component';

@Injectable()

export class ConfirmationService {
  dialogRef = inject(MatDialog);

  confirmation(
    {
      message = 'confirm.deletion?',
      cancel = 'no',
      confirm = 'yes'
    }: {
      message?: string,
      cancel?: string,
      confirm?: string
    } = {}
  ): Observable<boolean> {
    const dialog = this.dialogRef.open(
      ConfirmationComponent, {
        data: {
          message, cancel, confirm
        },
        width: '100%',
        maxWidth: '22rem'
      });
    return dialog.afterClosed();
  }
}
