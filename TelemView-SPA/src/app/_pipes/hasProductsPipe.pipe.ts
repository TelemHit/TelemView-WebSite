// pipe that returns data with counter greater then 0
// used in multifilter component

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hasProducts'
})
export class HasProductsPipe implements PipeTransform {

  transform(data: any): any {
    return data.filter(d => d.counter>0)
  }

}
