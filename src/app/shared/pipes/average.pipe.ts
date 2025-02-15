import { Pipe, PipeTransform } from '@angular/core';
import numbro from 'numbro';

@Pipe({
  name: 'average',
})
export class AveragePipe implements PipeTransform {
  public transform(value: number): string {
    return numbro(value).format({
      average: true,
      mantissa: value >= 1000 ? 1 : 0,
      trimMantissa: true,
    });
  }
}
