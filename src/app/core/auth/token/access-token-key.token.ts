import { InjectionToken } from '@angular/core';

export const ACCESS_TOKEN_KEY = new InjectionToken<string>('ACCESS_TOKEN_KEY', {
  providedIn: 'root',
  factory: () => 'accessToken',
});
