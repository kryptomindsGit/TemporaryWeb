import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkpackageViewComponent } from "./workpackage-view/workpackage-view.component";
import { IndependentProfComponent } from './independent-prof.component';
import { FreeBlockchainTimelineComponent } from './free-blockchain-timeline/free-blockchain-timeline.component';

const routes: Routes = [
  {
    path: 'indp',
    component: IndependentProfComponent,
    children: [
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(module => module.ProfileModule)
      },
      {
        path: 'workpackage',
        component: WorkpackageViewComponent
      },
      {
        path: 'free-blockchain-timeline',
        component: FreeBlockchainTimelineComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndependentProfRoutingModule { }
