import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { AddComponent } from './component/add/add.component';
import { ViewComponent } from './component/view/view.component';
import { EditComponent } from './component/edit/edit.component';


@NgModule({
  declarations: [AddComponent, ViewComponent, EditComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule
  ]
})
export class ProfileModule { }
