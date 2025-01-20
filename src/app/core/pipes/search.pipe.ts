import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true,
  pure: false
})

export class SearchPipe implements PipeTransform {
  transform(array: any[], props: string[], keyword: string): any[] {
    if (!array || !array?.length) {
      return [];
    }

    if (!keyword?.trim()?.length) {
      return array;
    }

    const result = [];

    array.forEach(item => {
      let exists = false;
      props.forEach(prop => {
        if (item[prop] && item[prop]?.toLowerCase().includes(keyword?.trim().toLowerCase())) {
          exists = true;
        }
      });
      if (exists) {
        result.push(item);
      }
    });

    return result;
  }
}
