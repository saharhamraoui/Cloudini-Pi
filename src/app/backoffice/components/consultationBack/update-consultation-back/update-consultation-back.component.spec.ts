import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateConsultationBackComponent } from './update-consultation-back.component';

describe('UpdateConsultationBackComponent', () => {
  let component: UpdateConsultationBackComponent;
  let fixture: ComponentFixture<UpdateConsultationBackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateConsultationBackComponent]
    });
    fixture = TestBed.createComponent(UpdateConsultationBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
