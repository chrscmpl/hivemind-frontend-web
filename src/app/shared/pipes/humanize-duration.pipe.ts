import { Pipe, PipeTransform } from '@angular/core';
import humanizeDuration from 'humanize-duration';

@Pipe({
  name: 'humanizeDuration',
})
export class HumanizeDurationPipe implements PipeTransform {
  private humanizer = humanizeDuration.humanizer({
    languages: {
      shortEn: {
        y: () => 'y',
        mo: () => 'mo',
        w: () => 'w',
        d: () => 'd',
        h: () => 'h',
        m: () => 'm',
        s: () => 's',
        ms: () => 'ms',
      },
    },
    round: true,
  });

  public transform(
    milliseconds: number,
    format?: 'full' | 'short',
    largest?: number,
    spacer?: string,
  ): string {
    const duration = this.humanizer(milliseconds, {
      largest: largest ?? Infinity,
      language: format === 'short' ? 'shortEn' : 'en',
      spacer: spacer ?? ' ',
    });

    return duration;
  }
}
