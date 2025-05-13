import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCommandesComponent } from './gestion-commandes.component';

describe('GestionCommandesComponent', () => {
  let component: GestionCommandesComponent;
  let fixture: ComponentFixture<GestionCommandesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionCommandesComponent]
    });
    fixture = TestBed.createComponent(GestionCommandesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
