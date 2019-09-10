import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartContractPaymentComponent } from './smart-contract-payment.component';

describe('SmartContractPaymentComponent', () => {
  let component: SmartContractPaymentComponent;
  let fixture: ComponentFixture<SmartContractPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartContractPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartContractPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
