import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '@env/environment';

@Pipe({
  name: 'imgUrl'
})
export class ImgUrlPipe implements PipeTransform {
  host = environment.host;

  transform(path: string | undefined): string {
    return this.host + path;
  }
}
