import { InjectionToken } from '@angular/core';

//heavily depends on the UI library used. Change when switching project
export const GET_THEME_COLOR = new InjectionToken<() => string | null>(
  'GET_THEME_COLOR',
  {
    providedIn: 'root',

    factory: () => () => {
      const div = document.createElement('div');
      div.setAttribute('tuitheme', 'dark');

      document.body.appendChild(div);

      const color =
        getComputedStyle(div).getPropertyValue('--tui-theme-color') || null;

      document.body.removeChild(div);

      return color;
    },
  },
);
