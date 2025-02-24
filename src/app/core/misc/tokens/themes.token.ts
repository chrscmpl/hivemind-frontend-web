import { InjectionToken } from '@angular/core';

// for themes to work, angular.json must be set up to create separate stylesheets
// with names 'theme-<light|dark>-<theme name>.css'
// default themes correspond to 'theme-<light|dark>.css'
export const THEMES = new InjectionToken<{ light: string[]; dark: string[] }>(
  'THEMES',
  {
    providedIn: 'root',
    factory: () => ({
      light: ['default', 'tree', 'candy'],
      dark: ['default', 'oled', 'terminal'],
    }),
  },
);
