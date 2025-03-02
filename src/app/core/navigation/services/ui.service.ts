import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { UIStylesEnum } from '../enums/ui-styles.enum';

@Injectable({
  providedIn: 'root',
})
export class UIService {
  private readonly _UIStyle: WritableSignal<UIStylesEnum> = signal(
    UIStylesEnum.DEFAULT,
  );

  get UIStyle(): Signal<UIStylesEnum> {
    return this._UIStyle;
  }

  public setUIStyle(style: UIStylesEnum): void {
    this._UIStyle.set(style);
  }
}
