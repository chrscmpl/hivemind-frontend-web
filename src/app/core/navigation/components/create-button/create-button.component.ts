import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-create-button',
  imports: [TuiButton, RouterLink],
  templateUrl: './create-button.component.html',
  styleUrl: './create-button.component.scss',
})
export class CreateButtonComponent {}
