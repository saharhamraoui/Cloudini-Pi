import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLeaveRequestComponent } from './list-leave-request.component';

describe('ListLeaveRequestComponent', () => {
  let component: ListLeaveRequestComponent;
  let fixture: ComponentFixture<ListLeaveRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListLeaveRequestComponent]
    });
    fixture = TestBed.createComponent(ListLeaveRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
