//import module's
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';

//import component's
import { ProfileRoutingModule } from './profile-routing.module';
import { ViewComponent } from './component/view/view.component';
import { AddComponent } from './component/add/add.component';
import { EditComponent } from './component/edit/edit.component';
import { ProfileComponent } from './profile.component';


//Component's
const COMPONENT = [
  ViewComponent,
  AddComponent,
  EditComponent,
  ProfileComponent
];

//Module's
const MODULE = [
  CommonModule,
  ProfileRoutingModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
  AutocompleteLibModule,
  NgxSmartModalModule.forChild(),
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
