import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndependentProfRoutingModule } from './independent-prof-routing.module';
import { IndependentProfComponent } from './independent-prof.component';


@NgModule({
  declarations: [IndependentProfComponent],
  imports: [
    CommonModule,
    IndependentProfRoutingModule
  ]
})
export class IndependentProfModule { }
