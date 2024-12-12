import { Pipe, PipeTransform } from '@angular/core';
import humanizeDuration from 'humanize-duration';

@Pipe({
  name: 'humanizeDuration',
})
export class HumanizeDurationPipe implements PipeTransform {
  public transform(milliseconds: number, largest?: number): string {
    const duration = humanizeDuration(milliseconds, {
      round: true,
      largest: largest ?? Infinity,
    });

    return duration;
  }
}
