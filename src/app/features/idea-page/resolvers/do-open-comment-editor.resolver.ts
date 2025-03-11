import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';

export const doOpenCommentEditorResolver: ResolveFn<boolean> = () =>
  inject(Router).getCurrentNavigation()?.extras.state?.['openCommentEditor'] ??
  false;
