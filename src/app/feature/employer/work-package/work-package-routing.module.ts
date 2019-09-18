import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddComponent } from './component/add/add.component';
import { ViewComponent } from './component/view/view.component';
import { EditComponent } from './component/edit/edit.component';
import { WorkPackageComponent } from './work-package.component';
import { AllWorkPackagesComponent } from './component/all-work-packages/all-work-packages.component';

const routes: Routes = [
  {
    path: 'workpack',
    component: WorkPackageComponent,
    children: [
      {
        path: 'add',
        component: AddComponent
      },
      {
        path: 'view/:id',
        component: ViewComponent
      },
      {
        path: 'edit/:id',
        component: EditComponent
      },
       {
        path: 'viewall',
        component:AllWorkPackagesComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkPackageRoutingModule {


}
