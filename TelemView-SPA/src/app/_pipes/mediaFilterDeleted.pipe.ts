import { Pipe, PipeTransform } from '@angular/core';
import { Media } from '../_models/media';

@Pipe({
  name: 'mediaFilterDeleted',
  pure: false
})
export class MediaFilterDeletedPipe implements PipeTransform {

  transform(items: Media[], filter: string): any {
    if (!items || !filter) {
      return items;
  }

    return items.filter(m => m.status.indexOf(filter) === -1);

  }

}
