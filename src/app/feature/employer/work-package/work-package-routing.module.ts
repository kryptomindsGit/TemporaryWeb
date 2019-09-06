import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddComponent } from './component/add/add.component';
import { ViewComponent } from './component/view/view.component';
import { EditComponent } from './component/edit/edit.component';

const routes: Routes = [
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkPackageRoutingModule {

  
 }
