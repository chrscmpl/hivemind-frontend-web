import { TestBed } from '@angular/core/testing';

import { PasswordStrengthMeasurerService } from '../services/password-strength-measurer.service';

describe('PasswordStrengthMeasurerService', () => {
  let service: PasswordStrengthMeasurerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordStrengthMeasurerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
