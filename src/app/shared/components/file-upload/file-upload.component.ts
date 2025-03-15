import { Component, inject, input, output, viewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FileService } from '../../services/file.service';
import { firstValueFrom } from 'rxjs';
import { IFile } from '../../interfaces/file.interface';

@Component({
  selector: 'file-upload',
  imports: [
    MatButton,
    MatIcon
  ],
  templateUrl: './file-upload.component.html',
  standalone: true
})

export class FileUploadComponent {
  fileInput = viewChild<HTMLInputElement>('fileInput');
  onFilesUpload = output<IFile[]>();

  accept = input<string[]>([ '.jpeg', '.jpg', '.png', '.svg' ]);
  multiple = input(true);
  maxSize = input(3);

  private fileService = inject(FileService);

  async onImagesSelected($event: Event) {
    const files = ($event.target as HTMLInputElement).files;

    const formData = new FormData();
    for (const file of Array.from(files)) {
      if (this.isValidFileType(file) && this.isValidSize(file)) {
        formData.append('file', file);
      }
    }
    this.fileInput().value = null;
    const uploadedFiles = await firstValueFrom(this.fileService.uploadFiles(formData));
    this.onFilesUpload.emit(uploadedFiles);
  }

  isValidFileType(file: File): boolean {
    const extension = `.${ file.type.split('/')[1] }`;
    return this.accept().includes(extension);
  }

  isValidSize(file: File): boolean {
    return this.maxSize() * 1024 * 1024 >= file.size;
  }
}
