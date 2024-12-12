import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeaFeedComponent } from '../idea-feed.component';

describe('IdeaFeedComponent', () => {
  let component: IdeaFeedComponent;
  let fixture: ComponentFixture<IdeaFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdeaFeedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IdeaFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
