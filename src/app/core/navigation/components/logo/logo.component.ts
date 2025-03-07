import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '@app/core/misc/services/theme.service';
import { fromEvent, Subscription, take } from 'rxjs';

@Component({
  selector: 'app-logo',
  imports: [RouterLink],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
})
export class LogoComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  private _defaultClasses = 'w-full h-full app-logo cursor-pointer';

  private _styleClass = this._defaultClasses;

  @Input() public set styleClass(value: string) {
    this._styleClass = `${this._defaultClasses} ${value}`;
  }

  public get styleClass(): string {
    return this._styleClass;
  }

  constructor(
    private themeService: ThemeService,
    private element: ElementRef,
  ) {}

  public ngOnInit(): void {
    this.subscriptions.push(
      this.themeService.themeLoading$.subscribe((loading) => {
        if (loading === true) {
          this.removeBackground();
        } else {
          this.addBackground();
        }
      }),
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private removeBackground(): void {
    this._defaultClasses = this._defaultClasses.replace('bg-logo', '');
    this._styleClass = this._styleClass.replace('bg-logo', '');
  }

  private addBackground(): void {
    const url = getComputedStyle(this.element.nativeElement)
      .getPropertyValue('--logo-url')
      .replace(/url\((.*)\)/, '$1');

    if (!url) {
      return;
    }

    const img = new Image();
    fromEvent(img, 'load', { passive: true })
      .pipe(take(1))
      .subscribe(() => {
        this._defaultClasses += ' bg-logo';
        this._styleClass += ' bg-logo';
      });

    img.src = url;
  }
}
