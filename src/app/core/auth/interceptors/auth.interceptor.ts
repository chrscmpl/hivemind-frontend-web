import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalStorageService } from '@app/core/misc/services/local-storage.service';
import { ACCESS_TOKEN_KEY } from '../const/access-token-key.const';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(LocalStorageService);
  const authorizationToken = storage.getItem(ACCESS_TOKEN_KEY);

  if (authorizationToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authorizationToken}`,
      },
    });
  }

  return next(req);
};
