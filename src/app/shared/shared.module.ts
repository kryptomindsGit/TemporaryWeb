import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { GlobalValidationDirective } from './global-validation.directive';
import { ControlMessageComponent } from './control-message/control-message.component';


@NgModule({
  declarations: [GlobalValidationDirective, ControlMessageComponent],
  imports: [
    CommonModule,
    SharedRoutingModule
  ]
})
export class SharedModule { }
