import {
  BrowserModule
} from '@angular/platform-browser';
import {
  NgModule
} from '@angular/core';

import {
  BanListModule
} from './ban/ban-list/ban-list.module';
import {
  AppComponent
} from './app.component';
import {
  ModalModule
} from './shared/modal/modal.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BanListModule,
    BrowserModule,
    ModalModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
