import { TestBed } from '@angular/core/testing';

import { VirtualKeyboardService } from '../services/virtual-keyboard.service';

describe('VirtualKeyboardService', () => {
  let service: VirtualKeyboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VirtualKeyboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
