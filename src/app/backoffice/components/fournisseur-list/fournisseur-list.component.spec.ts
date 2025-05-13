import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FournisseurListComponent } from './fournisseur-list.component';

describe('FournisseurListComponent', () => {
  let component: FournisseurListComponent;
  let fixture: ComponentFixture<FournisseurListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FournisseurListComponent]
    });
    fixture = TestBed.createComponent(FournisseurListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
