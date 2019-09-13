import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PartnerComponent } from './partner.component';


const routes: Routes = [
  {
    path:'part',
    component: PartnerComponent,
    children:[
      { 
        path: 'profile', 
        loadChildren: () => import('./profile/profile.module').then(module => module.ProfileModule) 
      }
    ]
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartnerRoutingModule { }
