import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ViewComponent } from './component/view/view.component';
import { AddComponent } from './component/add/add.component';
import { EditComponent } from './component/edit/edit.component';


@NgModule({
  declarations: [ViewComponent, AddComponent, EditComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule
  ]
})
export class ProfileModule { }
