import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkpackageViewComponent} from "./workpackage-view/workpackage-view.component";

const routes: Routes = [
  { 
    path: 'profile', 
    loadChildren: () => import(`./profile/profile.module`).then(module => module.ProfileModule) 
  },
  {
    path:'workpackage',
    component: WorkpackageViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndependentProfRoutingModule { }
