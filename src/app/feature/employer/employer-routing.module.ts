import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SmartContractPaymentComponent } from './smart-contract-payment/smart-contract-payment.component';


const routes: Routes = [
  { 
    path: 'profile', 
    loadChildren: () => import(`./profile/profile.module`).then(module => module.ProfileModule) 
  },
  { 
    path: 'workpackage', 
    loadChildren: () => import(`./work-package/work-package.module`).then(module => module.WorkPackageModule) 
  },
  { 
    path: 'smartpayment',
    component: SmartContractPaymentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployerRoutingModule { }
