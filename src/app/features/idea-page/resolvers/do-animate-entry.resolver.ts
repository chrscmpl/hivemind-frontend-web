import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

export const doAnimateEntryResolver: ResolveFn<boolean> = () =>
  (environment.animateIdeaEntry &&
    inject(Router).getCurrentNavigation()?.extras.state?.['animateEntry']) ??
  false;
