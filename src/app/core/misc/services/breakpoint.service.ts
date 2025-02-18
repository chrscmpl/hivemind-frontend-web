import {
  computed,
  Injectable,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { TuiBreakpointService } from '@taiga-ui/core';

@Injectable({
  providedIn: 'root',
})
export class BreakpointService {
  private readonly _isMobile: WritableSignal<boolean> = signal(false);
  private readonly _isDesktopSmall: WritableSignal<boolean> = signal(false);
  private readonly _isDesktopLarge: WritableSignal<boolean> = signal(false);
  private readonly _isDesktop: Signal<boolean> = computed(
    () => this._isDesktopSmall() || this._isDesktopLarge(),
  );

  public get isMobile(): Signal<boolean> {
    return this._isMobile;
  }

  public get isDesktopSmall(): Signal<boolean> {
    return this._isDesktopSmall;
  }

  public get isDesktopLarge(): Signal<boolean> {
    return this._isDesktopLarge;
  }

  public get isDesktop(): Signal<boolean> {
    return this._isDesktop;
  }

  constructor(private readonly breakpointService: TuiBreakpointService) {
    this.breakpointService.subscribe((breakpoint) => {
      switch (breakpoint) {
        case 'mobile': {
          this._isMobile.set(true);
          this._isDesktopSmall.set(false);
          this._isDesktopLarge.set(false);
          break;
        }
        case 'desktopSmall': {
          this._isMobile.set(false);
          this._isDesktopSmall.set(true);
          this._isDesktopLarge.set(false);
          break;
        }
        case 'desktopLarge': {
          this._isMobile.set(false);
          this._isDesktopSmall.set(false);
          this._isDesktopLarge.set(true);
          break;
        }
      }
    });
  }
}
