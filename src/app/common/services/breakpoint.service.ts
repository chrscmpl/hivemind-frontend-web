import { Injectable } from '@angular/core';
import { TuiBreakpointService } from '@taiga-ui/core';
import { distinctUntilChanged, map, merge, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BreakpointService {
  public readonly isMobile$: Observable<boolean>;
  public readonly isDesktopSmall$: Observable<boolean>;
  public readonly isDesktopLarge$: Observable<boolean>;
  public readonly isDesktop$: Observable<boolean>;

  constructor(private readonly breakpointService: TuiBreakpointService) {
    this.isMobile$ = this.breakpointService.pipe(
      map((breakpoint) => breakpoint === 'mobile')
    );
    this.isDesktopSmall$ = this.breakpointService.pipe(
      map((breakpoint) => breakpoint === 'desktopSmall')
    );
    this.isDesktopLarge$ = this.breakpointService.pipe(
      map((breakpoint) => breakpoint === 'desktopLarge')
    );
    this.isDesktop$ = merge(this.isDesktopSmall$, this.isDesktopLarge$).pipe(
      distinctUntilChanged()
    );
  }
}
