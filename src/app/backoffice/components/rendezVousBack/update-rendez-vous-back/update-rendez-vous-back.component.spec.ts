import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRendezVousBackComponent } from './update-rendez-vous-back.component';

describe('UpdateRendezVousBackComponent', () => {
  let component: UpdateRendezVousBackComponent;
  let fixture: ComponentFixture<UpdateRendezVousBackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateRendezVousBackComponent]
    });
    fixture = TestBed.createComponent(UpdateRendezVousBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
