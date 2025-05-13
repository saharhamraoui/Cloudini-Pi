import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountRequestComponentComponent } from './discount-request-component.component';

describe('DiscountRequestComponentComponent', () => {
  let component: DiscountRequestComponentComponent;
  let fixture: ComponentFixture<DiscountRequestComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiscountRequestComponentComponent]
    });
    fixture = TestBed.createComponent(DiscountRequestComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
