import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListConsultationComponent } from './list-consultation.component';

describe('ListConsultationComponent', () => {
  let component: ListConsultationComponent;
  let fixture: ComponentFixture<ListConsultationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListConsultationComponent]
    });
    fixture = TestBed.createComponent(ListConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
