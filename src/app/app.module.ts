import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {MaterialModule} from './material.module';


import {AppComponent} from './app.component';
import {NodeInputComponent} from './node-input/node-input.component';
import {SelectBoxComponent} from './node-input/select-box/select-box.component';


@NgModule({
  declarations: [
    AppComponent,
    NodeInputComponent,
    SelectBoxComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
