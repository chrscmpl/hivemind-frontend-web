import { Component } from '@angular/core';
import { TuiTabs } from '@taiga-ui/kit';
import { ThemeSettingsDialogComponent } from '../theme-settings-dialog/theme-settings-dialog.component';

@Component({
  selector: 'app-settings-dialog',
  imports: [TuiTabs, ThemeSettingsDialogComponent],
  templateUrl: './settings-dialog.component.html',
  styleUrl: './settings-dialog.component.scss',
})
export class SettingsDialogComponent {}
