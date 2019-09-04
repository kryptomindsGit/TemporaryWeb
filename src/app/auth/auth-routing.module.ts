import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { SignUpComponent } from './component/sign-up/sign-up.component';
import { AuthComponent } from './auth.component';
import { UportSignUpComponent } from './component/uport-sign-up/uport-sign-up.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';


const routes: Routes = [
  {
    path:  'auth',
    component:  AuthComponent,
    children: [
      {
        path:  'login',
        component:  LoginComponent
      },
      {
        path:  'sign-up',
        component:  SignUpComponent
      },
      {
        path:  'uport-signup',
        component:  UportSignUpComponent
      },
      // {
      //   path: '**',
      //   component: PageNotFoundComponent
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
