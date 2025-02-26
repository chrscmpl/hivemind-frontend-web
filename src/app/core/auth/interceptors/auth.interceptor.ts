import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalStorageService } from '@core/misc/services/local-storage.service';
import { ACCESS_TOKEN_KEY } from '../token/access-token-key.token';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const accessToken = inject(ACCESS_TOKEN_KEY);
  const storage = inject(LocalStorageService);
  const authorizationToken = storage.getItem(accessToken);

  if (authorizationToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authorizationToken}`,
      },
    });
  }

  return next(req);
};
