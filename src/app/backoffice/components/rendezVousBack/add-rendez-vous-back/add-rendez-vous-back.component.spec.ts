import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRendezVousBackComponent } from './add-rendez-vous-back.component';

describe('AddRendezVousBackComponent', () => {
  let component: AddRendezVousBackComponent;
  let fixture: ComponentFixture<AddRendezVousBackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddRendezVousBackComponent]
    });
    fixture = TestBed.createComponent(AddRendezVousBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
