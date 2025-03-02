import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { NavigationUtilsService } from '../services/navigation-utils.service';

export const confirmReloadGuard: (value: boolean) => CanActivateFn =
  (value) => () => {
    inject(NavigationUtilsService).executeIfNavigationSuccess(() => {
      if (value) {
        window.onbeforeunload = (e) => {
          const confirmMessage = 'Are you sure you want to leave?';
          e.returnValue = confirmMessage;
          return confirmMessage;
        };
      } else {
        if (window.onbeforeunload !== null) window.onbeforeunload = null;
      }
    });

    return true;
  };
