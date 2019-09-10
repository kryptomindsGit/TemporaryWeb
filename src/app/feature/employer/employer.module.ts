import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployerRoutingModule } from './employer-routing.module';
import { EmployerComponent } from './employer.component';
import { SmartContractPaymentComponent } from './smart-contract-payment/smart-contract-payment.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


@NgModule({
  declarations: [EmployerComponent, SmartContractPaymentComponent],
  imports: [
    CommonModule,
    EmployerRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EmployerModule { }
