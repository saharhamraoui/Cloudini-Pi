import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionmedsComponent } from './gestionmeds.component';

describe('GestionmedsComponent', () => {
  let component: GestionmedsComponent;
  let fixture: ComponentFixture<GestionmedsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionmedsComponent]
    });
    fixture = TestBed.createComponent(GestionmedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
