import { Injectable } from '@angular/core';
import { TuiAlertService } from '@taiga-ui/core';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiErrorsService {
  public constructor(private readonly alerts: TuiAlertService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public displayErrors(error: any): void {
    const errors: string[] =
      typeof error.error.message === 'string'
        ? [error.error.message]
        : error.error.message;

    errors.forEach((message) =>
      this.alerts
        .open(message, { appearance: 'negative', label: 'Error' })
        .pipe(take(1))
        .subscribe(),
    );
  }
}
