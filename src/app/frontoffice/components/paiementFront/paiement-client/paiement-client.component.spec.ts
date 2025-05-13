import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementClientComponent } from './paiement-client.component';

describe('PaiementClientComponent', () => {
  let component: PaiementClientComponent;
  let fixture: ComponentFixture<PaiementClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaiementClientComponent]
    });
    fixture = TestBed.createComponent(PaiementClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
