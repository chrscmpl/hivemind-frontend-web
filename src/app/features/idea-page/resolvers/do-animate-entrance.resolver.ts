import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';

export const doAnimateEntranceResolver: ResolveFn<boolean> = () =>
  inject(Router).getCurrentNavigation()?.extras.state?.['animate'] ?? false;
