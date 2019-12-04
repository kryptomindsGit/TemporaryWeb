// Module import
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';

//component import
import { EditComponent } from './component/edit/edit.component';
import { AddComponent } from './component/add/add.component';
import { ViewComponent } from './component/view/view.component';
import { ProfileComponent } from './profile.component';
// import { ControlMessageComponent } from '../../../shared/control-message/control-message.component';


//Component's
const COMPONENT = [
  EditComponent,
  AddComponent,
  ViewComponent,
  ProfileComponent,
  // ControlMessageComponent
];

//Module's
const MODULE = [
  CommonModule,
  ProfileRoutingModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
  NgxLoadingModule.forRoot({}),
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
