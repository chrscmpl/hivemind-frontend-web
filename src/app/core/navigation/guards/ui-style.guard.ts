import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { NavigationUtilsService } from '@app/core/misc/services/navigation-utils.service';
import { UIService } from '../services/ui.service';
import { UIStylesEnum } from '../enums/ui-styles.enum';

export const uiStyleGuard: (style: UIStylesEnum) => CanActivateFn =
  (style) => () => {
    const navigationUtils = inject(NavigationUtilsService);
    const ui = inject(UIService);

    navigationUtils.executeIfNavigationSuccess(() => {
      ui.setUIStyle(style);
    });

    return true;
  };
