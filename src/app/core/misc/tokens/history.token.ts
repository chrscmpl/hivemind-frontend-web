import { InjectionToken } from '@angular/core';

export const HISTORY = new InjectionToken<History>('HISTORY', {
  providedIn: 'root',
  factory: () => history,
});
