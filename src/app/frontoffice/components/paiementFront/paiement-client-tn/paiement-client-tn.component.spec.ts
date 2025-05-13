import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementClientTnComponent } from './paiement-client-tn.component';

describe('PaiementClientTnComponent', () => {
  let component: PaiementClientTnComponent;
  let fixture: ComponentFixture<PaiementClientTnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaiementClientTnComponent]
    });
    fixture = TestBed.createComponent(PaiementClientTnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
