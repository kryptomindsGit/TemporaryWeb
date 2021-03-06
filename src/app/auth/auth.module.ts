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
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { BnNgIdleService } from 'bn-ng-idle';

// module's
const MODULES = [
  CommonModule,
  AuthRoutingModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
  NgxLoadingModule.forRoot({
    // animationType: ngxLoadingAnimationTypes.cubeGrid,
    // backdropBackgroundColour: 'rgba(0,0,0,0.1)',
    // backdropBorderRadius: '4px',
    // primaryColour: '#ffffff',
    // secondaryColour: '#ffffff',
    // tertiaryColour: '#ffffff'
  }),
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
  providers: [BnNgIdleService],
  imports: [
    ...MODULES
  ]
})
export class AuthModule { }
