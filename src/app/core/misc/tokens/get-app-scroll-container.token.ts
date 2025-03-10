import { InjectionToken } from '@angular/core';

//Change when switching project
export const GET_APP_SCROLL_CONTAINER = new InjectionToken<
  () => Element | null
>('GET_APP_SCROLL_CONTAINER', {
  providedIn: 'root',

  factory: () => () => document.getElementById('app-scroll-container'),
});
