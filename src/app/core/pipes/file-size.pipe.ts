import { Pipe, PipeTransform } from '@angular/core';
import { IFile } from '../models/file.model';

@Pipe({
	name: 'fileSize',
	standalone: true,
})

export class FileSizePipe implements PipeTransform {
	transform(file: IFile): any {
		if (file && file.size) {
			return file.size / 1000 / 1000;
		}
		return '-';
	}
}
