import { TestBed } from '@angular/core/testing';

import { ChatWindowService } from './chat-window.service';

describe('ChatWindowService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChatWindowService = TestBed.get(ChatWindowService);
    expect(service).toBeTruthy();
  });
});
