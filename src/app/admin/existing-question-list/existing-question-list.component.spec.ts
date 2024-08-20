import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingQuestionListComponent } from './existing-question-list.component';

describe('ExistingQuestionListComponent', () => {
  let component: ExistingQuestionListComponent;
  let fixture: ComponentFixture<ExistingQuestionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExistingQuestionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExistingQuestionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
