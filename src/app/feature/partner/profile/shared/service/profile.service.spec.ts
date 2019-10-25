import { TestBed } from '@angular/core/testing';

import { PartProfileService } from './profile.service';

describe('ProfileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PartProfileService = TestBed.get(PartProfileService);
    expect(service).toBeTruthy();
  });
});
