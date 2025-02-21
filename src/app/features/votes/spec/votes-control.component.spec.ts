import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotesControlComponent } from '../components/votes-control.component';

describe('VotesControlComponent', () => {
  let component: VotesControlComponent;
  let fixture: ComponentFixture<VotesControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VotesControlComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VotesControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
