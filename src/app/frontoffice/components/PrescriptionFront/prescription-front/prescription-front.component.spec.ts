import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionFrontComponent } from './prescription-front.component';

describe('PrescriptionFrontComponent', () => {
  let component: PrescriptionFrontComponent;
  let fixture: ComponentFixture<PrescriptionFrontComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrescriptionFrontComponent]
    });
    fixture = TestBed.createComponent(PrescriptionFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
