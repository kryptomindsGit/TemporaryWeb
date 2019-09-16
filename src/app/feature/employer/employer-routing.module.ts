import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SmartContractPaymentComponent } from './smart-contract-payment/smart-contract-payment.component';
import { EmployerComponent } from './employer.component';
import { ProjectTimelineComponent } from './project-timeline/project-timeline.component';
import { BlockchainTimelineComponent } from './blockchain-timeline/blockchain-timeline.component';


const routes: Routes = [
  {
    path: 'emp',
    component: EmployerComponent,
    children: [
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(module => module.ProfileModule)
      },
      {
        path: 'workpackage',
        loadChildren: () => import('./work-package/work-package.module').then(module => module.WorkPackageModule)
      },
      {
        path: 'smartpayment',
        component: SmartContractPaymentComponent
      },
      {
        path: 'proj-timeline',
        component: ProjectTimelineComponent
      },
      {
        path: 'block-timeline',
        component: BlockchainTimelineComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployerRoutingModule { }
