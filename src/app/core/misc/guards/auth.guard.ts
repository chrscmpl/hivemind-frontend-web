import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/auth/services/auth.service';
import { DialogEnum } from '@core/dialogs/dialog.enum';
import { DialogsService } from '@core/dialogs/dialogs.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (_, state) => {
  const auth = inject(AuthService);

  return auth.authChecked$.pipe(
    map(() => {
      if (auth.isAuthenticated()) {
        return true;
      }

      inject(DialogsService)
        .open(DialogEnum.LOGIN)
        .subscribe({
          complete: () => {
            if (auth.isAuthenticated()) {
              inject(Router).navigateByUrl(state.url);
            }
          },
        });

      return false;
    }),
  );
};
