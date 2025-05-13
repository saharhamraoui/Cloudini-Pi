import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BilanListComponent } from './bilan-list.component';

describe('BilanListComponent', () => {
  let component: BilanListComponent;
  let fixture: ComponentFixture<BilanListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BilanListComponent]
    });
    fixture = TestBed.createComponent(BilanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
