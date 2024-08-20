import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSourceTemplateComponent } from './create-source-template.component';

describe('CreateSourceTemplateComponent', () => {
  let component: CreateSourceTemplateComponent;
  let fixture: ComponentFixture<CreateSourceTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSourceTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSourceTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
