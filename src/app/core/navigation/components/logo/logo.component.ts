import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '@app/core/misc/services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-logo',
  imports: [RouterLink],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
})
export class LogoComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  private _src = 'logo.svg';

  public get src(): string {
    return this._src;
  }

  @Input() public styleClass: string = '';

  public constructor(private readonly themeService: ThemeService) {}

  public ngOnInit(): void {
    this.subscriptions.push(
      this.themeService.themeStatus$.subscribe((status) => {
        this._src =
          status.theme === 'dark' && status.variations.dark === 'terminal'
            ? 'logo-terminal.svg'
            : 'logo.svg';
      }),
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
