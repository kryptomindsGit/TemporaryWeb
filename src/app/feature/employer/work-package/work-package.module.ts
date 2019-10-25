import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { WorkPackageRoutingModule } from './work-package-routing.module';
import { WorkPackageComponent } from './work-package.component';
import { AddComponent } from './component/add/add.component';
import { ViewComponent } from './component/view/view.component';
import { EditComponent } from './component/edit/edit.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllWorkPackagesComponent } from './component/all-work-packages/all-work-packages.component';
import { SearchFreelancerComponent } from './component/search-freelancer/search-freelancer.component';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
  declarations: [WorkPackageComponent, AddComponent, ViewComponent, EditComponent, AllWorkPackagesComponent, SearchFreelancerComponent],
  imports: [
    CommonModule,
    WorkPackageRoutingModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUsefulSwiperModule,
    NgxLoadingModule.forRoot({})
  ]
})
export class WorkPackageModule {




}
