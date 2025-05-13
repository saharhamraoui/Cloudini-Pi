import { TestBed } from '@angular/core/testing';

import { KonnectPaymentService } from './konnect-payment.service';

describe('KonnectPaymentService', () => {
  let service: KonnectPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KonnectPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
