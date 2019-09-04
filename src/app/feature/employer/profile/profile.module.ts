import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';

import { EditComponent } from './component/edit/edit.component';
import { AddComponent } from './component/add/add.component';
import { ViewComponent } from './component/view/view.component';


@NgModule({
  declarations: [EditComponent, AddComponent, ViewComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule
  ]
})
export class ProfileModule { }
