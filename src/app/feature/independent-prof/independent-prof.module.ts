import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndependentProfRoutingModule } from './independent-prof-routing.module';
import { IndependentProfComponent } from './independent-prof.component';
import { WorkpackageViewComponent } from './workpackage-view/workpackage-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { FreeBlockchainTimelineComponent } from './free-blockchain-timeline/free-blockchain-timeline.component';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';

@NgModule({
  declarations: [IndependentProfComponent, WorkpackageViewComponent, FreeBlockchainTimelineComponent],
  imports: [
    CommonModule,
    IndependentProfRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUsefulSwiperModule,
    NgxLoadingModule.forRoot({
    }),
  ]
})
export class IndependentProfModule { }
