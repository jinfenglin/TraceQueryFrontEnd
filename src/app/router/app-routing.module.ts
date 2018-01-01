import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TraceGraphComponent} from '../trace-graph/trace-graph.component';
import {NodeInputComponent} from '../node-input/node-input.component';
const routes: Routes = [
  {path: '', component: NodeInputComponent},
  {path: 'traceGraph', component: TraceGraphComponent}
];
@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {
}
