import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuivreCommandeComponent } from './suivre-commande.component';

describe('SuivreCommandeComponent', () => {
  let component: SuivreCommandeComponent;
  let fixture: ComponentFixture<SuivreCommandeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuivreCommandeComponent]
    });
    fixture = TestBed.createComponent(SuivreCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
