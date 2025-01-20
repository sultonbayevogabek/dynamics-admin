import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { MatRipple } from '@angular/material/core';

@Component({
  selector: 'confirmation',
  templateUrl: 'confirmation.component.html',
  imports: [
    MatButton,
    MatDialogContent,
    TranslateModule,
    MatRipple
  ],
  standalone: true
})

export class ConfirmationComponent {
  dialogRef = inject(MatDialogRef<ConfirmationComponent>);
  @Inject(MAT_DIALOG_DATA) data: {
    message: string;
    cancel: string;
    confirm: string;
  } = inject(MAT_DIALOG_DATA);

  confirmationAction(result: boolean): void {
    this.dialogRef.close(result);
  }
}
