import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenFilename'
})
export class ShortenFilenamePipe implements PipeTransform {
  transform(value: string): string {
    const parts = value.split('-');
    if (parts.length < 3) return value; // Minimal format nazarda tutilgan

    const firstPart = parts[0].slice(0, 3); // "174"
    const namePart = parts[2].split('.')[0].slice(0, 5); // Fayl nomining 5 ta belgisi
    const extension = parts[2].split('.').slice(1).join('.'); // Kengaytma

    return `${firstPart}.x${namePart}.${extension}`;
  }
}
