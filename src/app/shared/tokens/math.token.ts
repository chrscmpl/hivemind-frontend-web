import { InjectionToken } from '@angular/core';

export const MATH = new InjectionToken<Math>('MATH', {
  providedIn: 'root',
  factory: () => Math,
});
