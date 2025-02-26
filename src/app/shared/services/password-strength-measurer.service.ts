import { Inject, Injectable } from '@angular/core';
import { passwordStrengthEnum } from '../enums/password-strength.enum';
import { PASSWORD_PATTERNS } from '@shared/tokens/password-patterns.token';
import { PasswordPatternsEntity } from '@shared/entities/password-patterns.entity';

@Injectable({
  providedIn: 'root',
})
export class PasswordStrengthMeasurerService {
  public constructor(
    @Inject(PASSWORD_PATTERNS)
    private readonly passwordPatterns: PasswordPatternsEntity,
  ) {}

  public measure(password: string): passwordStrengthEnum | null {
    if (password.match(this.passwordPatterns.validStrong)) {
      return passwordStrengthEnum.STRONG;
    }
    if (password.match(this.passwordPatterns.valid)) {
      return passwordStrengthEnum.MEDIUM;
    }
    if (password.match(this.passwordPatterns.invalidWeak)) {
      return passwordStrengthEnum.WEAK;
    }
    return null;
  }
}
