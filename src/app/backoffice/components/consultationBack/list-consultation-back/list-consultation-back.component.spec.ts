import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListConsultationBackComponent } from './list-consultation-back.component';

describe('ListConsultationBackComponent', () => {
  let component: ListConsultationBackComponent;
  let fixture: ComponentFixture<ListConsultationBackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListConsultationBackComponent]
    });
    fixture = TestBed.createComponent(ListConsultationBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
