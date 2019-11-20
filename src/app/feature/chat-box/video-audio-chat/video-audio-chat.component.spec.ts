import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoAudioChatComponent } from './video-audio-chat.component';

describe('VideoAudioChatComponent', () => {
  let component: VideoAudioChatComponent;
  let fixture: ComponentFixture<VideoAudioChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoAudioChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoAudioChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
