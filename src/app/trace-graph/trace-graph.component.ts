import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {InputDisplayBridgeService} from '../services/input-display-bridge/input-display-bridge.service';
import {Vertex} from '../data-structure/vertex';
import {TraceQueryService} from '../services/trace-query/trace-query.service';
import * as vis from 'vis';
import * as $ from 'jquery';
@Component({
  selector: 'app-trace-graph',
  templateUrl: './trace-graph.component.html',
  styleUrls: ['./trace-graph.component.css']
})
export class TraceGraphComponent implements OnInit, AfterViewInit {
  sourceAndTarget: Vertex[][];
  @ViewChild('traceGraph') traceGraph;

  constructor(private bridge: InputDisplayBridgeService, private traceProvider: TraceQueryService) {

    console.log(this.traceGraph);
    // this.bridge.getSourceTarget().subscribe(st => this.sourceAndTarget = st);
    // const res = traceProvider.getJsonResult(this.sourceAndTarget[0], this.sourceAndTarget[1]);
    //
    // const config = {
    //   dataSource: res,
    // };
    // const network = new vis.Network(this.traceGraph, data, options);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const nodes = new vis.DataSet([
      {id: 1, label: 'Node 1'},
      {id: 2, label: 'Node 2'},
      {id: 3, label: 'Node 3'},
      {id: 4, label: 'Node 4'},
      {id: 5, label: 'Node 5'}
    ]);

    // create an array with edges
    const edges = new vis.DataSet([
      {from: 1, to: 3},
      {from: 1, to: 2},
      {from: 2, to: 4},
      {from: 2, to: 5},
      {from: 3, to: 3}
    ]);
    console.log(this.traceGraph)
    const data = {
      nodes: nodes,
      edges: edges
    };
    const options = {};
    const network = new vis.Network(this.traceGraph.nativeElement, data, options);
  }


}
