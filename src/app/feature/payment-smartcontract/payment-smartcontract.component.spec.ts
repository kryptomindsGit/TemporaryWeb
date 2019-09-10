import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSmartcontractComponent } from './payment-smartcontract.component';

describe('PaymentSmartcontractComponent', () => {
  let component: PaymentSmartcontractComponent;
  let fixture: ComponentFixture<PaymentSmartcontractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentSmartcontractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSmartcontractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
