import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSourceTemplateComponent } from './edit-source-template.component';

describe('EditSourceTemplateComponent', () => {
  let component: EditSourceTemplateComponent;
  let fixture: ComponentFixture<EditSourceTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSourceTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSourceTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
