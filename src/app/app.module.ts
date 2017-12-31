import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {MyMaterialModule} from './material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {NodeInputComponent} from './node-input/node-input.component';
import {SelectBoxComponent} from './node-input/select-box/select-box.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {VertexProviderService} from './vertex-provider/vertex-provider.service';



@NgModule({
  declarations: [
    AppComponent,
    NodeInputComponent,
    SelectBoxComponent
  ],
  imports: [
    BrowserModule,
    MyMaterialModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    FormsModule, ReactiveFormsModule,
  ],
  providers: [VertexProviderService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
