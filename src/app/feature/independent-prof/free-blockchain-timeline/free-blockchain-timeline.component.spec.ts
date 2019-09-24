import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeBlockchainTimelineComponent } from './free-blockchain-timeline.component';

describe('FreeBlockchainTimelineComponent', () => {
  let component: FreeBlockchainTimelineComponent;
  let fixture: ComponentFixture<FreeBlockchainTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreeBlockchainTimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeBlockchainTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
