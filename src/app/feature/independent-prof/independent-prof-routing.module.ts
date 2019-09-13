import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkpackageViewComponent} from "./workpackage-view/workpackage-view.component";
import { IndependentProfComponent } from './independent-prof.component';

const routes: Routes = [
  {
    path: 'indp',
    component: IndependentProfComponent,
    children:[
      { 
        path: 'profile', 
        loadChildren: () => import('./profile/profile.module').then(module => module.ProfileModule) 
      },
      {
        path:'workpackage',
        component: WorkpackageViewComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndependentProfRoutingModule { }
