import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '@core/auth/services/auth.service';
import { DialogEnum } from '@core/dialogs/dialog.enum';
import { DialogsService } from '@core/dialogs/dialogs.service';
import { of, switchMap } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const dialogs = inject(DialogsService);

  return auth.authChecked$.pipe(
    switchMap(() =>
      auth.isAuthenticated() ? of(true) : dialogs.open(DialogEnum.LOGIN),
    ),
  );
};
