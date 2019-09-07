// import module's
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

//import Component's
import { LoginComponent } from './component/login/login.component';
import { SignUpComponent } from './component/sign-up/sign-up.component';
import { UportSignUpComponent } from './component/uport-sign-up/uport-sign-up.component';
import { AuthComponent } from './auth.component';
import { UportLoginComponent } from './component/uport-login/uport-login.component';

// module's
const MODULES = [
  CommonModule,
  AuthRoutingModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
];

// component's
const COMPONENTS = [
  AuthComponent,
  LoginComponent,
  SignUpComponent,
  UportSignUpComponent,
  UportLoginComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS,
  ],
  imports: [
    ...MODULES
  ]
})
export class AuthModule { }
