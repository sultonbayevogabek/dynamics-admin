import { Component, input, model, output } from '@angular/core';
import { IFile } from '../../interfaces/file.interface';
import { environment } from '../../../../environments/environment';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'file-list',
  imports: [
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger
  ],
  templateUrl: './file-list.component.html',
  standalone: true
})

export class FileListComponent {
  filesChange = output<IFile[]>();
  host = environment.host;
  viewType = input<'grid' | 'label'>('label');

  classes = input<string>('grid-cols-4');
  files = model<IFile[]>();

  removeFile(file: IFile) {
    this.files.update(oldValue => oldValue.filter(i => i.path !== file.path));
    this.filesChange.emit(this.files());
  }
}
