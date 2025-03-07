import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-logo',
  imports: [RouterLink],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
})
export class LogoComponent {
  private _styleClass = '';

  @Input() public set styleClass(value: string) {
    this._styleClass = value + ' cursor-pointer';
  }

  public get styleClass(): string {
    return this._styleClass;
  }
}
