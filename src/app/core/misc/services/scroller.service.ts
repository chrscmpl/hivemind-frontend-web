import { ViewportScroller } from '@angular/common';
import { Injectable } from '@angular/core';

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
  public constructor(private readonly viewportScroller: ViewportScroller) {}

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
      this.viewportScroller.scrollToPosition([
        options.coordinates.x,
        options.coordinates.y,
      ]);
    } else if (options.anchor) {
      this.viewportScroller.scrollToAnchor(options.anchor);
    }
  }

  private setSmoothScrolling(value: boolean): void {
    if (value) document.documentElement.style.scrollBehavior = 'smooth';
    else document.documentElement.style.scrollBehavior = 'auto';
  }
}
