import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BilanUploadComponent } from './bilan-upload.component';

describe('BilanUploadComponent', () => {
  let component: BilanUploadComponent;
  let fixture: ComponentFixture<BilanUploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BilanUploadComponent]
    });
    fixture = TestBed.createComponent(BilanUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
