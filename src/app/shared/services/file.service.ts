import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { map, Observable } from 'rxjs';
import { IFile } from '../interfaces/file.interface';

@Injectable({
  providedIn: 'root',
})

export class FileService extends RequestService {
  uploadFiles(files: FormData): Observable<IFile[]> {
    return this.request<{
      message: string;
      files: IFile[];
    }>('file-upload/upload', files)
      .pipe(
        map((response) => response.files || [])
      )
  }
}
