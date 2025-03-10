import { Inject, Injectable } from '@angular/core';
import { GET_APP_SCROLL_CONTAINER } from '../tokens/get-app-scroll-container.token';

type ScrollOptions = {
  smooth?: boolean;
} & (
  | {
      coordinates: { x: number; y: number };
      anchor?: never;
    }
  | {
      anchor: string;
      coordinates?: never;
    }
);

@Injectable({
  providedIn: 'root',
})
export class ScrollerService {
  public constructor(
    @Inject(GET_APP_SCROLL_CONTAINER)
    private readonly getAppScrollContainer: () => Element | null,
  ) {}

  public scroll(options: ScrollOptions): void {
    if (!options.coordinates && !options.anchor) {
      return;
    }

    if (options.smooth) {
      this.executeSmoothScroll(options);
    } else {
      this.executeScroll(options);
    }
  }

  private executeSmoothScroll(options: ScrollOptions): void {
    this.setSmoothScrolling(true);
    setTimeout(() => {
      this.executeScroll(options);
      setTimeout(() => {
        this.setSmoothScrolling(false);
      }, 1000);
    }, 100);
  }

  private executeScroll(options: ScrollOptions): void {
    if (options.coordinates) {
      const appScrollContainer = this.getAppScrollContainer();
      if (appScrollContainer) {
        appScrollContainer.scrollTo({
          top: options.coordinates.y,
          left: options.coordinates.x,
          behavior: options.smooth ? 'smooth' : 'instant',
        });
      }
    } else if (options.anchor) {
      const anchor = document.getElementById(options.anchor);
      if (anchor) {
        anchor.scrollIntoView({
          behavior: options.smooth ? 'smooth' : 'instant',
        });
      }
    }
  }

  private setSmoothScrolling(value: boolean): void {
    if (value) document.documentElement.style.scrollBehavior = 'smooth';
    else document.documentElement.style.scrollBehavior = 'auto';
  }
}
