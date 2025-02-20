import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalStorageService } from '@app/core/misc/services/local-storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(LocalStorageService);
  const authorizationToken = storage.getItem('accessToken');

  if (authorizationToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authorizationToken}`,
      },
    });
  }

  return next(req);
};
