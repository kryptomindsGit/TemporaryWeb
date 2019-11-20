import { TestBed } from '@angular/core/testing';

import { VideoAudioChatService } from './video-audio-chat.service';

describe('VideoAudioChatService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VideoAudioChatService = TestBed.get(VideoAudioChatService);
    expect(service).toBeTruthy();
  });
});
