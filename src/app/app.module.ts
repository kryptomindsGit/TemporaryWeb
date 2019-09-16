//import Module's
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';

//import Component,s
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FullLayoutEnduserComponent } from './core/component/full-layout-enduser/full-layout-enduser.component';



//Components
const COMPONENTS = [
  AppComponent,
  PageNotFoundComponent,
  FullLayoutEnduserComponent

];

//Modules
const MODULES = [
  CommonModule,
  BrowserModule,
  BrowserAnimationsModule,
  AppRoutingModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
  ToastrModule.forRoot({
    timeOut: 2000,
  }) // ToastrModule added
];

@NgModule({
  declarations: [
    ...COMPONENTS,
  ],
  imports: [
    ...MODULES,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
