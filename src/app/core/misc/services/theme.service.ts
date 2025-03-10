import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import {
  Observable,
  ReplaySubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  shareReplay,
  skip,
  startWith,
  take,
} from 'rxjs';
import { MediaMatcher } from '@angular/cdk/layout';
import { isEqual } from 'lodash-es';
import { LocalStorageService } from './local-storage.service';
import { GET_THEME_COLOR } from '../tokens/get-theme-color.token';
import { THEMES } from '../tokens/themes.token';
import { DOCUMENT } from '@angular/common';

export type theme = 'light' | 'dark';

interface themeStatus {
  theme: theme;
  variations: {
    light: string;
    dark: string;
  };
  isSystemPreference: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;

  public lightThemeVariations: readonly string[];
  public darkThemeVariations: readonly string[];

  private systemPreference$!: Observable<theme>;
  public themeStatus$!: Observable<themeStatus>;
  private theme$!: Observable<string>;

  private manuallySetTheme$: ReplaySubject<theme | null> =
    new ReplaySubject<theme | null>(1);

  private lightThemeVariation$: ReplaySubject<string> =
    new ReplaySubject<string>(1);

  private darkThemeVariation$: ReplaySubject<string> =
    new ReplaySubject<string>(1);

  private _themeLoading$ = new ReplaySubject<boolean>(1);

  public get themeLoading$(): Observable<boolean> {
    return this._themeLoading$;
  }

  public constructor(
    private readonly storage: LocalStorageService,
    @Inject(GET_THEME_COLOR)
    private readonly getThemeColor: () => string | null,
    @Inject(DOCUMENT) private readonly document: Document,
    mediaMatcher: MediaMatcher,
    rendererFactory: RendererFactory2,
    @Inject(THEMES) themes: { light: string[]; dark: string[] },
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.lightThemeVariations = themes.light;
    this.darkThemeVariations = themes.dark;

    this.initObservables(mediaMatcher);

    this.subscribeToObservables();

    this.manuallySetTheme$.next(this.getSavedThemeFromStorage());
    this.lightThemeVariation$.next(
      this.getThemeVariationFromStorage('light') ?? 'default',
    );
    this.darkThemeVariation$.next(
      this.getThemeVariationFromStorage('dark') ?? 'default',
    );
  }

  private initObservables(mediaMatcher: MediaMatcher): void {
    const matchDarkTheme = mediaMatcher.matchMedia(
      '(prefers-color-scheme: dark)',
    );

    this.systemPreference$ = fromEvent<MediaQueryListEvent>(
      matchDarkTheme,
      'change',
    ).pipe(
      startWith(matchDarkTheme),
      map((e) => (e.matches ? 'dark' : 'light')),
      shareReplay(1),
    );

    this.themeStatus$ = combineLatest([
      this.systemPreference$,
      this.manuallySetTheme$,
      this.lightThemeVariation$,
      this.darkThemeVariation$,
    ]).pipe(
      debounceTime(100),
      map(
        ([
          systemPreference,
          manuallySetTheme,
          lightVariation,
          darkVariation,
        ]) => {
          const theme = manuallySetTheme ?? systemPreference;

          return {
            theme,
            variations: {
              light: lightVariation ?? 'default',
              dark: darkVariation ?? 'default',
            },
            isSystemPreference: !manuallySetTheme,
          };
        },
      ),
      distinctUntilChanged(isEqual),
      shareReplay(1),
    );

    this.theme$ = this.themeStatus$.pipe(
      map((status: themeStatus) => {
        const variation =
          status.theme === 'light'
            ? status.variations.light
            : status.variations.dark;
        return `${status.theme}${
          variation && variation !== 'default' ? `-${variation}` : ''
        }`;
      }),
      distinctUntilChanged(isEqual),
      shareReplay(1),
    );
  }

  private subscribeToObservables(): void {
    const themeLink = this.document.head.querySelector('.theme-link') ?? null;
    if (themeLink) this.onThemeLoad();
    const skipCount = themeLink ? 1 : 0;

    this.theme$.pipe(skip(skipCount)).subscribe(this.onThemeChange.bind(this));

    this.theme$.pipe(take(1)).subscribe(this.onFirstThemeLoad.bind(this));
  }

  public setTheme(theme: theme | 'system'): void {
    const isSystemPreference = theme === 'system';
    this.saveThemeToStorage(isSystemPreference ? null : theme);
    this.manuallySetTheme$.next(isSystemPreference ? null : theme);
  }

  public setThemeVariation(theme: theme, variation: string): void {
    this.saveThemeVariationToStorage(theme, variation);
    if (theme === 'light') this.lightThemeVariation$.next(variation);
    else this.darkThemeVariation$.next(variation);
  }

  private getSavedThemeFromStorage(): theme | null {
    return this.storage.getItem('theme') as theme | null;
  }

  private saveThemeToStorage(theme: theme | null): void {
    if (theme) this.storage.setItem('theme', theme);
    else this.storage.removeItem('theme');
  }

  private getThemeVariationFromStorage(theme: theme): string | null {
    return this.storage.getItem(`${theme}-theme-variation`);
  }

  private saveThemeVariationToStorage(theme: theme, variation: string): void {
    this.storage.setItem(`${theme}-theme-variation`, variation);
  }

  private createStyleSheetLink(): HTMLLinkElement {
    const link = this.renderer.createElement('link');
    this.renderer.setAttribute(link, 'rel', 'stylesheet');
    this.renderer.setAttribute(link, 'type', 'text/css');
    this.renderer.setAttribute(link, 'class', 'theme-link');
    this.renderer.appendChild(this.document.head, link);
    return link;
  }

  private destroyOldStyleSheets(newLink: HTMLLinkElement): void {
    const links = this.document.head.querySelectorAll('.theme-link');
    links.forEach((link) => {
      if (link === newLink) return;
      this.renderer.removeChild(this.document.head, link);
    });
  }

  private onThemeChange(theme: string): void {
    this._themeLoading$.next(true);
    const href = `./theme-${theme}.css`;

    const themeLink = this.createStyleSheetLink();

    fromEvent(themeLink, 'load', { passive: true })
      .pipe(take(1))
      .subscribe(() => {
        this.destroyOldStyleSheets(themeLink);
        this.onThemeLoad(theme);
      });

    this.renderer.setAttribute(themeLink, 'href', href);
  }

  private onThemeLoad(theme?: string): void {
    this.updateThemeColor();
    this._themeLoading$.next(false);
    if (theme) {
      this.document.documentElement.setAttribute(
        'data-theme',
        theme.startsWith('light') ? 'light' : 'dark',
      );
    }
  }

  private updateThemeColor(): void {
    const themeColor = this.getThemeColor();

    if (themeColor)
      this.document.head
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', themeColor);
  }

  private onFirstThemeLoad(theme: string): void {
    this.checkStorageIntegrity();
    this.unCacheUnusedThemes(theme);
  }

  private checkStorageIntegrity(): void {
    const theme = this.getSavedThemeFromStorage();
    const lightVariation = this.getThemeVariationFromStorage('light');
    const darkVariation = this.getThemeVariationFromStorage('dark');

    if (theme && !['light', 'dark'].includes(theme)) this.setTheme('system');

    if (lightVariation && !this.lightThemeVariations.includes(lightVariation))
      this.setThemeVariation('light', 'default');

    if (darkVariation && !this.darkThemeVariations.includes(darkVariation))
      this.setThemeVariation('dark', 'default');
  }

  private unCacheUnusedThemes(theme: string): void {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        if (!cacheName.includes('themes')) return;
        caches.open(cacheName).then((cache) => {
          cache.keys().then((requests) => {
            requests.forEach((request) => {
              if (!request.url.includes(`theme-${theme}.css`)) {
                cache.delete(request);
              }
            });
          });
        });
      });
    });
  }
}
