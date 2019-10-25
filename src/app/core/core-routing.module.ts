import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { CoreComponent } from './core.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path:  'core',
    component:  CoreComponent,
    children: [
      // {
      //   path:  'dashboard',
      //   component:  DashboardComponent
      // },
      {
        path:  'header',
        component: HeaderComponent
      },
      {
        path:  'footer',
        component:  FooterComponent
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
export class CoreRoutingModule { }
