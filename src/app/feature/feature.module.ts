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
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { VedioAudioChattingComponent } from './chat-box/vedio-audio-chatting/vedio-audio-chatting.component';
import { environment } from 'src/environments/environment';
import Keyboard from 'simple-keyboard';
// import SimpleKeyboardLayout from '../../../node_modules/simple-keyboard-layouts';
// import { VideoAudioChatComponent } from './chat-box/video-audio-chat/video-audio-chat.component';
//Components
const COMPONENTS = [
  FeatureComponent,
  DashboardComponent,
  HeaderComponent,
  FooterComponent,
  SidebarComponent,
  FullLayoutComponent,
  ChatBoxComponent
];

//Modules
const MODULES = [
  CommonModule,
  FeatureRoutingModule,
  AutocompleteLibModule,
  FormsModule,
  ReactiveFormsModule
];

@NgModule({
  declarations: [
    ...COMPONENTS,
    PaymentSmartcontractComponent,
    // VedioAudioChattingComponent,
    // VideoAudioChatComponent
  ],
  imports: [
    ...MODULES,
  ]
})
export class FeatureModule { }
