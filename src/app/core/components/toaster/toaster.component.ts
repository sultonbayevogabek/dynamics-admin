import { Component, inject, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { NgClass, NgStyle } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MatRipple } from '@angular/material/core';

@Component({
  selector: 'toaster',
  templateUrl: './toaster.component.html',
  styleUrls: [ './toaster.component.scss' ],
  imports: [
    NgStyle,
    NgClass,
    MatIcon,
    TranslateModule,
    MatRipple
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
  } = inject(MAT_SNACK_BAR_DATA);

  dismissSnackbar(): void {
    this._snackBarRef.dismiss()
  }
}
