import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { theme, ThemeService } from '@app/core/misc/services/theme.service';
import { TuiButton, TuiDataList, TuiDropdown, TuiLoader } from '@taiga-ui/core';
import {
  TuiChevron,
  TuiDataListDropdownManager,
  TuiRadio,
} from '@taiga-ui/kit';
import {
  debounceTime,
  delay,
  Observable,
  skip,
  Subscription,
  take,
} from 'rxjs';

@Component({
  selector: 'app-theme-settings-dialog',
  imports: [
    ReactiveFormsModule,
    TuiRadio,
    TuiLoader,
    TuiDataList,
    TuiDataListDropdownManager,
    TuiButton,
    TuiChevron,
    TuiDropdown,
    AsyncPipe,
    TitleCasePipe,
  ],
  templateUrl: './theme-settings-dialog.component.html',
  styleUrl: './theme-settings-dialog.component.scss',
})
export class ThemeSettingsDialogComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  public themeVariationDropdownOpen = false;
  public currentTheme?: theme;

  public form = new FormGroup({
    theme: new FormControl<theme | 'system' | null>(null),
    lightThemeVariation: new FormControl<string | null>(null),
    darkThemeVariation: new FormControl<string | null>(null),
  });

  private lightThemeVariationOptions: string[];

  private darkThemeVariationOptions: string[];

  public themeVariationOptions: Record<
    theme,
    {
      theme: theme;
      control: FormControl<string | null>;
      options: string[];
    }
  >;

  public themeLoading$: Observable<boolean>;

  constructor(private readonly theme: ThemeService) {
    this.lightThemeVariationOptions = [...this.theme.lightThemeVariations];
    this.darkThemeVariationOptions = [...this.theme.darkThemeVariations];
    this.themeLoading$ = this.theme.themeLoading$.pipe(
      debounceTime(100),
      delay(1000),
    );
    this.themeVariationOptions = {
      light: {
        theme: 'light',
        control: this.form.controls.lightThemeVariation,
        options: this.lightThemeVariationOptions,
      },
      dark: {
        theme: 'dark',
        control: this.form.controls.darkThemeVariation,
        options: this.darkThemeVariationOptions,
      },
    };
  }

  public ngOnInit(): void {
    this.subscriptions = this.subscriptions.concat([
      this.form.controls.theme.valueChanges.pipe(skip(1)).subscribe((value) => {
        if (value) this.theme.setTheme(value);
      }),

      this.form.controls.lightThemeVariation.valueChanges
        .pipe(skip(1))
        .subscribe((value) => {
          this.theme.setThemeVariation('light', value ?? 'default');
          this.themeVariationDropdownOpen = false;
        }),

      this.form.controls.darkThemeVariation.valueChanges
        .pipe(skip(1))
        .subscribe((value) => {
          this.theme.setThemeVariation('dark', value ?? 'default');
          this.themeVariationDropdownOpen = false;
        }),

      this.theme.themeStatus$.subscribe((theme) => {
        this.currentTheme = theme.theme;
      }),
    ]);

    this.theme.themeStatus$.pipe(take(1)).subscribe((theme) => {
      if (theme.isSystemPreference) this.form.controls.theme.setValue('system');
      else this.form.controls.theme.setValue(theme.theme);
      this.form.controls.lightThemeVariation.setValue(theme.variations.light);
      this.form.controls.darkThemeVariation.setValue(theme.variations.dark);
    });
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
