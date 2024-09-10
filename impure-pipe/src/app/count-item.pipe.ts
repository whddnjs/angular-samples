import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countItems',
  standalone: true,
  pure: false
})
export class CountItemsPipe implements PipeTransform {
  transform(items: string[]): number {
    return items.length;
  }
}