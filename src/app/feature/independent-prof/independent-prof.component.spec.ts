import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndependentProfComponent } from './independent-prof.component';

describe('IndependentProfComponent', () => {
  let component: IndependentProfComponent;
  let fixture: ComponentFixture<IndependentProfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndependentProfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndependentProfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
