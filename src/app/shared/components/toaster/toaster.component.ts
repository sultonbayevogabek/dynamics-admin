import { Component, inject, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'toaster',
  templateUrl: './toaster.component.html',
  styleUrls: [ './toaster.component.scss' ],
  imports: [
    MatIconModule,
    MatRippleModule
  ],
  standalone: true
})

export class ToasterComponent {
  private _snackBarRef: MatSnackBarRef<ToasterComponent> = inject(MatSnackBarRef<ToasterComponent>)
  @Inject(MAT_SNACK_BAR_DATA) public data: {
    type: 'success' | 'warning' | 'info' | 'error';
    title: string;
    message: string;
    dismissible: boolean;
    duration: number;
    showProgressBar: boolean
    showCloseButton: boolean
  } = inject(MAT_SNACK_BAR_DATA);

  dismissSnackbar(): void {
    this._snackBarRef.dismiss()
  }
}
