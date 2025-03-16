import { Component, input, model, output, signal } from '@angular/core';
import { IFile } from '../../interfaces/file.interface';
import { environment } from '@env/environment';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'file-list',
  imports: [
    MatIcon,
    MatIconButton
  ],
  templateUrl: './file-list.component.html',
  standalone: true
})

export class FileListComponent {
  filesChange = output<IFile[]>();
  host = environment.host;
  openedFile = signal<IFile>(null);

  viewType = input<'grid' | 'label'>('label');

  classes = input<string>('grid-cols-4');
  files = model<IFile[]>();

  removeFile(file: IFile) {
    this.files.update(oldValue => oldValue.filter(i => i.path !== file.path));
    this.filesChange.emit(this.files());
  }

  openFileView(file: IFile) {
    this.openedFile.set(file)
  }
}
