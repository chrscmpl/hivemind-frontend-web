import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/auth/services/auth.service';
import { DialogEnum } from '@core/dialogs/dialog.enum';
import { DialogsService } from '@core/dialogs/dialogs.service';

export const authGuard: CanActivateFn = (_, state) => {
  const auth = inject(AuthService);

  if (auth.isAuthenticated()) {
    return true;
  }

  const router = inject(Router);

  inject(DialogsService)
    .open(DialogEnum.LOGIN)
    .subscribe({
      complete: () => {
        if (auth.isAuthenticated()) {
          router.navigateByUrl(state.url);
        }
      },
    });

  return false;
};
