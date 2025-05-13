import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMedcicalRecordComponent } from './list-medcical-record.component';

describe('ListMedcicalRecordComponent', () => {
  let component: ListMedcicalRecordComponent;
  let fixture: ComponentFixture<ListMedcicalRecordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListMedcicalRecordComponent]
    });
    fixture = TestBed.createComponent(ListMedcicalRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
