import { TestBed } from '@angular/core/testing';

import { CustomGlobalService } from './custom-global.service';

describe('CustomGlobalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomGlobalService = TestBed.get(CustomGlobalService);
    expect(service).toBeTruthy();
  });
});
