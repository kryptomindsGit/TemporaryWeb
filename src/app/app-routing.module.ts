import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//components
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FullLayoutEnduserComponent } from './core/component/full-layout-enduser/full-layout-enduser.component';

//Routing
const routes: Routes = [
  // {
  //   path: '**',
  //   component: PageNotFoundComponent
  // },
  {
    path: 'auth',
    loadChildren: () => import(`./auth/auth.module`).then(module => module.AuthModule)
  },
  {
    path: 'core',
    loadChildren: () => import(`./core/core.module`).then(module => module.CoreModule)
  },
  {
    path: 'feature',
    loadChildren: () => import(`./feature/feature.module`).then(module => module.FeatureModule)
  },
  {
    path: 'shared',
    loadChildren: () => import(`./shared/shared.module`).then(module => module.SharedModule)
  },
  {
    path: 'landing',
    component: FullLayoutEnduserComponent
  },
  {
    path: '',
    redirectTo: '/landing',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
