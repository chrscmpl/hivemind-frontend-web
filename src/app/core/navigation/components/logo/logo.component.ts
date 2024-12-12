import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-logo',
  imports: [RouterLink],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
})
export class LogoComponent {
  private _minimal: boolean = false;
  @Input() public styleClass: string = '';
  @Input() public set minimal(value: boolean | '') {
    this._minimal = !!value || value === '';
  }

  public get minimal(): boolean {
    return this._minimal;
  }
}
