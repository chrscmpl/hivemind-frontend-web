import { Pipe, PipeTransform } from '@angular/core';
import numbro from 'numbro';

@Pipe({
  name: 'average',
})
export class AveragePipe implements PipeTransform {
  public transform(value: number): string {
    return numbro(value)
      .format({
        average: true,
        mantissa: 1,
        roundingFunction: (n: number) =>
          n >= 0 ? Math.floor(n) : Math.ceil(n),
      })
      .replace(/\.0(?=[\w]?$)/, '');
  }
}
