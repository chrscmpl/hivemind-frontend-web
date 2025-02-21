import { Injectable } from '@angular/core';
import { passwordStrengthEnum } from '../enums/password-strength.enum';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PasswordStrengthMeasurerService {
  public measure(password: string): passwordStrengthEnum {
    if (password.match(environment.passwordStrengthPatterns.strong)) {
      return passwordStrengthEnum.STRONG;
    }
    if (password.match(environment.passwordStrengthPatterns.medium)) {
      return passwordStrengthEnum.MEDIUM;
    }
    return passwordStrengthEnum.WEAK;
  }
}
