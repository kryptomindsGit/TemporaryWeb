import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployerRoutingModule } from './employer-routing.module';
import { EmployerComponent } from './employer.component';
import { SmartContractPaymentComponent } from './smart-contract-payment/smart-contract-payment.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ProjectTimelineComponent } from './project-timeline/project-timeline.component';
import { BlockchainTimelineComponent } from './blockchain-timeline/blockchain-timeline.component';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';

@NgModule({
  declarations: [EmployerComponent, SmartContractPaymentComponent, ProjectTimelineComponent, BlockchainTimelineComponent],
  imports: [
    CommonModule,
    EmployerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxLoadingModule.forRoot({}),
  ]
})
export class EmployerModule { }
