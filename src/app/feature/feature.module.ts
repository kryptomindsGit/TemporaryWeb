import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//Routing
import { FeatureRoutingModule } from './feature-routing.module';
//components
import { FeatureComponent } from './feature.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FullLayoutComponent } from './full-layout/full-layout.component';
import { PaymentSmartcontractComponent } from './payment-smartcontract/payment-smartcontract.component';

//Components
const COMPONENTS = [
  FeatureComponent, 
  DashboardComponent, 
  HeaderComponent, 
  FooterComponent, 
  SidebarComponent, 
  FullLayoutComponent
];

//Modules
const MODULES = [
  CommonModule,
  FeatureRoutingModule
];

@NgModule({
  declarations: [
    ...COMPONENTS,
    PaymentSmartcontractComponent
  ],
  imports: [
    ...MODULES
  ]
})
export class FeatureModule { }
