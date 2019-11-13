import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VedioAudioChattingComponent } from './vedio-audio-chatting.component';

describe('VedioAudioChattingComponent', () => {
  let component: VedioAudioChattingComponent;
  let fixture: ComponentFixture<VedioAudioChattingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VedioAudioChattingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VedioAudioChattingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
