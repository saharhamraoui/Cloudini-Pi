import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRendezVousBackComponent } from './list-rendez-vous-back.component';

describe('ListRendezVousBackComponent', () => {
  let component: ListRendezVousBackComponent;
  let fixture: ComponentFixture<ListRendezVousBackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListRendezVousBackComponent]
    });
    fixture = TestBed.createComponent(ListRendezVousBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
