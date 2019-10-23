import { TestBed } from '@angular/core/testing';

import { EmpProfileService } from './profile.service';

describe('EmpProfileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmpProfileService = TestBed.get(EmpProfileService);
    expect(service).toBeTruthy();
  });
});
