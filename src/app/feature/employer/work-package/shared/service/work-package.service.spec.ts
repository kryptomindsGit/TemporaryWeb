import { TestBed } from '@angular/core/testing';

import { WorkPackageService } from './work-package.service';

describe('WorkPackageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkPackageService = TestBed.get(WorkPackageService);
    expect(service).toBeTruthy();
  });
});
