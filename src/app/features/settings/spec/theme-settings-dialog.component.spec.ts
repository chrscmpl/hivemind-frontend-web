import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeSettingsDialogComponent } from '../components/theme-settings-dialog/theme-settings-dialog.component';

describe('ThemeSettingsDialogComponent', () => {
  let component: ThemeSettingsDialogComponent;
  let fixture: ComponentFixture<ThemeSettingsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeSettingsDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeSettingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
