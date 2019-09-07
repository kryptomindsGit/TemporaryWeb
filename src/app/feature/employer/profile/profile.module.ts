// Module import
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

//component import
import { EditComponent } from './component/edit/edit.component';
import { AddComponent } from './component/add/add.component';
import { ViewComponent } from './component/view/view.component';
import { ProfileComponent } from './profile.component';

//Component's
const COMPONENT = [
  EditComponent,
  AddComponent,
  ViewComponent,
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
