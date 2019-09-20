import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFreelancerComponent } from './search-freelancer.component';

describe('SearchFreelancerComponent', () => {
  let component: SearchFreelancerComponent;
  let fixture: ComponentFixture<SearchFreelancerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchFreelancerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFreelancerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
