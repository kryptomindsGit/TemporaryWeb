import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Components
import { FeatureComponent } from './feature.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FullLayoutComponent } from './full-layout/full-layout.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';

//Routing
const routes: Routes = [
  {
    path: 'feature',
    component: FeatureComponent,
    children: [
      // {
      //   path: 'dashboard',
      //   component: DashboardComponent
      // },
      // {
      //   path: 'header',
      //   component: HeaderComponent
      // },
      // {
      //   path: 'sidebar',
      //   component: SidebarComponent
      // },
      {
        path: 'full-layout',
        component: FullLayoutComponent,
        children: [
          {
            path: 'dashboard',
            component: DashboardComponent
          },
          {
            path: 'employer',
            loadChildren: () => import(`./employer/employer.module`).then(module => module.EmployerModule)
          },
          {
            path: 'partner',
            loadChildren: () => import(`./partner/partner.module`).then(module => module.PartnerModule)
          },
          {
            path: 'independent',
            loadChildren: () => import(`./independent-prof/independent-prof.module`).then(module => module.IndependentProfModule)
          }
        ]
      }
      // {
      //   path: 'footer',
      //   component: FooterComponent
      // }

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
export class FeatureRoutingModule { }
