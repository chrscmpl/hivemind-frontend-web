import { Pipe, PipeTransform } from '@angular/core';
import prettyMilliseconds from 'pretty-ms';

@Pipe({
  name: 'humanizeDuration',
})
export class HumanizeDurationPipe implements PipeTransform {
  public transform(milliseconds: number): string {
    return milliseconds < 2000
      ? 'now'
      : prettyMilliseconds(milliseconds, {
          compact: true,
        });
  }
}
