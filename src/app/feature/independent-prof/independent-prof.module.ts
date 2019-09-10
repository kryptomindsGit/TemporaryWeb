import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndependentProfRoutingModule } from './independent-prof-routing.module';
import { IndependentProfComponent } from './independent-prof.component';
import { WorkpackageViewComponent } from './workpackage-view/workpackage-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';


@NgModule({
  declarations: [IndependentProfComponent, WorkpackageViewComponent],
  imports: [
    CommonModule,
    IndependentProfRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUsefulSwiperModule
  ]
})
export class IndependentProfModule { }
