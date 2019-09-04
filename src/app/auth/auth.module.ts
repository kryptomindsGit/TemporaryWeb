import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';

import { LoginComponent } from './component/login/login.component';
import { SignUpComponent } from './component/sign-up/sign-up.component';
import { UportSignUpComponent } from './component/uport-sign-up/uport-sign-up.component';
import { AuthComponent } from './auth.component';

// module's

const MODULES = [
  CommonModule,
  AuthRoutingModule
];

// component's

const COMPONENTS = [
  AuthComponent,
  LoginComponent,
  SignUpComponent,
  UportSignUpComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS
     
  ],
  imports: [
    ...MODULES
  ]
})
export class AuthModule { }
