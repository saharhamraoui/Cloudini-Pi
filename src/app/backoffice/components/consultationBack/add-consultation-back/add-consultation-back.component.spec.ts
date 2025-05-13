import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConsultationBackComponent } from './add-consultation-back.component';

describe('AddConsultationBackComponent', () => {
  let component: AddConsultationBackComponent;
  let fixture: ComponentFixture<AddConsultationBackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddConsultationBackComponent]
    });
    fixture = TestBed.createComponent(AddConsultationBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
