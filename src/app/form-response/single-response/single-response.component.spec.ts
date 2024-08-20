import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleResponseComponent } from './single-response.component';

describe('SingleResponseComponent', () => {
  let component: SingleResponseComponent;
  let fixture: ComponentFixture<SingleResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleResponseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
