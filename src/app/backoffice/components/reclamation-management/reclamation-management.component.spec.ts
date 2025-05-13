import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReclamationManagementComponent } from './reclamation-management.component';

describe('ReclamationManagementComponent', () => {
  let component: ReclamationManagementComponent;
  let fixture: ComponentFixture<ReclamationManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReclamationManagementComponent]
    });
    fixture = TestBed.createComponent(ReclamationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
