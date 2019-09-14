import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockchainTimelineComponent } from './blockchain-timeline.component';

describe('BlockchainTimelineComponent', () => {
  let component: BlockchainTimelineComponent;
  let fixture: ComponentFixture<BlockchainTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockchainTimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockchainTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
