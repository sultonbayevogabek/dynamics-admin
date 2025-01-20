import { Component, DestroyRef, EventEmitter, inject, Input, Output } from '@angular/core';
import { IFile } from '../../models/file.model';
import { MatIcon } from '@angular/material/icon';
import { FileSizePipe } from '../../pipes/file-size.pipe';
import { DecimalPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FileService } from '../../services/file.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatRipple } from '@angular/material/core';

@Component({
  selector: 'file-component',
  standalone: true,
  imports: [
    MatIcon,
    FileSizePipe,
    DecimalPipe,
    TranslateModule,
    MatRipple
  ],
  templateUrl: './file-component.component.html',
})

export class FileComponentComponent {
  @Input() file: IFile;
  @Input() removable = false;
  @Output('onFileRemoved') fileRemoved = new EventEmitter<string>();

  private _fileService = inject(FileService);
  private _destroyRef = inject(DestroyRef);

  downloadFile(): void {
    this._fileService.downloadById(this.file.id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe()
  }

  removeFile(): void {
    this.fileRemoved.emit(this.file.id);
  }
}
