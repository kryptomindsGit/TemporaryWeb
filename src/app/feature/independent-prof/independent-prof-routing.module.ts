import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { 
    path: 'profile', 
    loadChildren: () => import(`./profile/profile.module`).then(module => module.ProfileModule) 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndependentProfRoutingModule { }
