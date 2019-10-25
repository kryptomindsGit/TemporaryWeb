//import module's
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

//import component's
import { ProfileRoutingModule } from './profile-routing.module';
import { AddComponent } from './component/add/add.component';
import { ViewComponent } from './component/view/view.component';
import { EditComponent } from './component/edit/edit.component';
import { ProfileComponent } from './profile.component';



//component's
const COMPONENT = [
  AddComponent,
  ViewComponent,
  EditComponent,
  ProfileComponent
];

//Module's
const MODULE = [
  CommonModule,
  ProfileRoutingModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule
];

@NgModule({
  declarations: [
    ...COMPONENT
  ],
  imports: [
    ...MODULE

  ]
})
export class ProfileModule { }
