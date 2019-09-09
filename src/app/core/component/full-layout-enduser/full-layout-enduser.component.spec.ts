import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullLayoutEnduserComponent } from './full-layout-enduser.component';

describe('FullLayoutEnduserComponent', () => {
  let component: FullLayoutEnduserComponent;
  let fixture: ComponentFixture<FullLayoutEnduserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullLayoutEnduserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullLayoutEnduserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
