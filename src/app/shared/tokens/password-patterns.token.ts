import { InjectionToken } from '@angular/core';
import { PasswordPatternsEntity } from '../entities/password-patterns.entity';

export const PASSWORD_PATTERNS = new InjectionToken<PasswordPatternsEntity>(
  'PASSWORD_PATTERNS',
  {
    providedIn: 'root',
    factory: () => ({
      invalidWeak: /^(?=.*[\d\W])(?=.*[a-zA-Z]).{4,}$/,
      valid: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s]).{8,}$/,
      validStrong: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s]).{12,}$/,
    }),
  },
);
