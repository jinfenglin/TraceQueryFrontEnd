import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {MyMaterialModule} from './material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {NodeInputComponent} from './node-input/node-input.component';
import {SelectBoxComponent} from './node-input/select-box/select-box.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {VertexProviderService} from './services/vertex-provider/vertex-provider.service';
import {TraceGraphComponent} from './trace-graph/trace-graph.component';
import {AppRoutingModule} from './router/app-routing.module';
import {InputDisplayBridgeService} from './services/input-display-bridge/input-display-bridge.service';
import {TraceQueryService} from './services/trace-query/trace-query.service';


@NgModule({
  declarations: [
    AppComponent,
    NodeInputComponent,
    SelectBoxComponent,
    TraceGraphComponent
  ],
  imports: [
    BrowserModule,
    MyMaterialModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    FormsModule, ReactiveFormsModule,
    AppRoutingModule,
  ],
  providers: [VertexProviderService, InputDisplayBridgeService, TraceQueryService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
