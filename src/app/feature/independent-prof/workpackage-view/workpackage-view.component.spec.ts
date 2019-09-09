import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkpackageViewComponent } from './workpackage-view.component';

describe('WorkpackageViewComponent', () => {
  let component: WorkpackageViewComponent;
  let fixture: ComponentFixture<WorkpackageViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkpackageViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkpackageViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
