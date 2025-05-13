import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctordashboardComponent } from './doctordashboard.component';

describe('DoctordashboardComponent', () => {
  let component: DoctordashboardComponent;
  let fixture: ComponentFixture<DoctordashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DoctordashboardComponent]
    });
    fixture = TestBed.createComponent(DoctordashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
