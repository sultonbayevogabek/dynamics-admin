import { Component, ElementRef, input, viewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { IAcceptType } from '../../interfaces/accept-file-type.interface';
import { Element } from '@angular/compiler';

@Component({
  selector: 'file-upload',
  imports: [
    MatButton,
    MatIcon
  ],
  templateUrl: './file-upload.component.html'
})

export class FileUploadComponent {
  fileInput = viewChild<HTMLInputElement>('fileInput');

  accept = input<string[]>([ '.jpeg', '.jpg', '.png' ]);
  multiple = input(true);
  maxSize = input(3);

  async onImagesSelected($event: Event) {
    const files = ($event.target as HTMLInputElement).files;
    for (const file of Array.from(files)) {
      if (this.isValidFileType(file)) {

      }
    }
  }

  isValidFileType(file: File): boolean {
    const extension = file.type.split('/')[1];
    return this.accept().includes(extension)
  }

  isValidFileType(file: File): boolean {
    const extension = file.type.split('/')[1];
    return this.accept().includes(extension)
  }
}
