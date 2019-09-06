import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//Routing
import { AppRoutingModule } from './app-routing.module';
//Components
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

//Components
const COMPONENTS =[
  AppComponent
];

//Modules
const MODULES = [
  BrowserModule,
  AppRoutingModule,
  OwlDateTimeModule, 
  OwlNativeDateTimeModule 
];

@NgModule({
  declarations: [
    ...COMPONENTS,
    PageNotFoundComponent
  ],
  imports: [
    ...MODULES
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
