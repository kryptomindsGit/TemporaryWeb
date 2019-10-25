import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllWorkPackagesComponent } from './all-work-packages.component';

describe('AllWorkPackagesComponent', () => {
  let component: AllWorkPackagesComponent;
  let fixture: ComponentFixture<AllWorkPackagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllWorkPackagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllWorkPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
