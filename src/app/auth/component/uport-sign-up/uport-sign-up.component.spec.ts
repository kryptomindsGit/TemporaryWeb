import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UportSignUpComponent } from './uport-sign-up.component';

describe('UportSignUpComponent', () => {
  let component: UportSignUpComponent;
  let fixture: ComponentFixture<UportSignUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UportSignUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UportSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
