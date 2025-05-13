import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalRecordFrontComponent } from './medical-record-front.component';

describe('MedicalRecordFrontComponent', () => {
  let component: MedicalRecordFrontComponent;
  let fixture: ComponentFixture<MedicalRecordFrontComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MedicalRecordFrontComponent]
    });
    fixture = TestBed.createComponent(MedicalRecordFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
