import { TestBed } from '@angular/core/testing';

import { IndeptProfileService } from './profile.service';

describe('IndeptProfileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IndeptProfileService = TestBed.get(IndeptProfileService);
    expect(service).toBeTruthy();
  });
});
