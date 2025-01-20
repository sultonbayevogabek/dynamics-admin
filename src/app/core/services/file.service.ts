import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FileService {
  filePartSize = 1024 * 1024;
  files: any[] = [];

  private _httpClient = inject(HttpClient);

  readFileContent(file: File): Promise<ArrayBuffer> {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.addEventListener('error', reject);
      fileReader.addEventListener('load', (event) => {
        resolve((event.target as any).result);
      });
      fileReader.readAsArrayBuffer(file);
    });
  }

  async uploadFile(file: File): Promise<any> {
    const buffer = await this.readFileContent(file);
    const { name, size, type } = file;
    const fileParts = splitBlob(file, this.filePartSize);
    console.log({
      buffer,
      name,
      size,
      type: name.includes('.rar') ? 'application/x-rar' : type
    });
    const fileInfo: any = await this._httpClient.post(environment.host + 'files.upload', {
        buffer,
        name,
        size,
        type: name.includes('.rar') ? 'application/x-rar' : type
      }, {
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    }).toPromise();
    if (fileInfo.id) {
      fileInfo.totalPartCount = fileParts.length;
      fileInfo.completedPartCount = 0;
      this.files.push(fileInfo);
      return fileInfo;
    }
  }

  downloadById(id: string): any {
    if (!id) {
      return;
    }
    return this._httpClient.post(environment.host + 'files.download', {
      fileId: id
    })
      .pipe(
        tap((file: any) => {
          this.downloadFile(file);
        }),
      );
  }

  downloadFile(file: any): void {
    const blob = new Blob([new Uint8Array(file.content)], { type: file.type });
    const url = window.URL.createObjectURL(blob);
    file.objectUrl = url;
    this.downloadURL(url, file.name);
    setTimeout(() => window.URL.revokeObjectURL(url), 1000);
  }

  downloadURL(data, fileName): void {
    const a: any = document.createElement('a');
    a.href = data;
    a.download = fileName;
    document.body.appendChild(a);
    a.style = 'display: none';
    a.click();
    a.remove();
  }
}

const splitBlob = (blob: Blob, size: number): any => {
  const parts = [];
  let from = 0;
  while (from < blob.size) {
    parts.push(blob.slice(from, from + size));
    from += size;
  }
  return parts;
};
