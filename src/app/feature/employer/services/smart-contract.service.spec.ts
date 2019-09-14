import { TestBed } from '@angular/core/testing';

import { SmartContractService } from './smart-contract.service';

describe('SmartContractService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SmartContractService = TestBed.get(SmartContractService);
    expect(service).toBeTruthy();
  });
});
