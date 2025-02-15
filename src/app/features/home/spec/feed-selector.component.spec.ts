import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedSelectorComponent } from '../components/feed-selector/feed-selector.component';

describe('FeedSelectorComponent', () => {
  let component: FeedSelectorComponent;
  let fixture: ComponentFixture<FeedSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
