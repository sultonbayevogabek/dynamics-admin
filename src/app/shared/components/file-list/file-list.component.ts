import { Component, input, model, output } from '@angular/core';
import { IFile } from '../../interfaces/file.interface';
import { environment } from '../../../../environments/environment';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'file-list',
  imports: [
    MatIcon
  ],
  templateUrl: './file-list.component.html',
  standalone: true
})

export class FileListComponent {
  filesChange = output<IFile[]>();
  host = environment.host;

  classes = input<string>('grid-cols-4');
  files = model<IFile[]>();

  removeFile(file: IFile) {
    this.files.update(oldValue => oldValue.filter(i => i.path !== file.path));
    this.filesChange.emit(this.files())
  }
}
