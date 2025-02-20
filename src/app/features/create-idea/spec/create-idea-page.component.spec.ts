import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIdeaPageComponent } from '../create-idea-page.component';

describe('CreateIdeaPageComponent', () => {
  let component: CreateIdeaPageComponent;
  let fixture: ComponentFixture<CreateIdeaPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateIdeaPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateIdeaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
