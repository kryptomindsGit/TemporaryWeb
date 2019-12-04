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
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';

//import Component,s
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FullLayoutEnduserComponent } from './core/component/full-layout-enduser/full-layout-enduser.component';
import { AuthModule } from './auth/auth.module';
import { environment } from 'src/environments/environment';
// import { LoginComponent } from './auth/component/login/login.component';


//Components
const COMPONENTS = [
  AppComponent,
  PageNotFoundComponent,
  FullLayoutEnduserComponent,
  // LoginComponent

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
  NgxLoadingModule.forRoot({
    // animationType: ngxLoadingAnimationTypes.cubeGrid,
    // backdropBackgroundColour: 'rgba(0,0,0,0.1)',
    // backdropBorderRadius: '4px',
    // primaryColour: '#ffffff',
    // secondaryColour: '#ffffff',
    // tertiaryColour: '#ffffff'
  }),
  ToastrModule.forRoot({
    timeOut: 2000,
  }),// ToastrModule added
  AuthModule
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
