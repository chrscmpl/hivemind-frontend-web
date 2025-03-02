import { InjectionToken } from '@angular/core';

export const MATH = new InjectionToken<Math>('Math', {
  providedIn: 'root',
  factory: () => Math,
});
