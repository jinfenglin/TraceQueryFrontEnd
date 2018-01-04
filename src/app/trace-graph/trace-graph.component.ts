import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {InputDisplayBridgeService} from '../services/input-display-bridge/input-display-bridge.service';
import {Vertex} from '../data-structure/vertex';
import {TraceQueryService} from '../services/trace-query/trace-query.service';
import * as vis from 'vis';
import {VisNode} from '../data-structure/visNode';
import {VisEdge} from '../data-structure/visEdge';
@Component({
  selector: 'app-trace-graph',
  templateUrl: './trace-graph.component.html',
  styleUrls: [
    './trace-graph.component.css',
  ]
})
export class TraceGraphComponent implements OnInit, AfterViewInit {
  sourceAndTarget: Vertex[][];
  @ViewChild('traceGraph') traceGraph;
  selectedNode: VisNode;
  selectedNodeEdges: VisEdge[];

  constructor(private bridge: InputDisplayBridgeService, private traceProvider: TraceQueryService) {
    this.selectedNode = {id: 2, label: 'Node 2'};
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
    const rawNode: VisNode[] = [
      {id: 1, label: 'Node 1'},
      {id: 2, label: 'Node 2'},
      {id: 3, label: 'Node 3'},
      {id: 4, label: 'Node 4'},
      {id: 5, label: 'Node 5'}
    ]
    const nodes = new vis.DataSet(rawNode);

    // create an array with edges
    const rawEdge: VisEdge[] = [
      {id: 1, from: 1, to: 3, title: 'score=1 \n method=default'},
      {id: 2, from: 1, to: 2, title: 'score=1 \n method=default'},
      {id: 3, from: 2, to: 4, title: 'score=1 \n method=default'},
      {id: 4, from: 2, to: 5, title: 'score=1 \n method=default'},
      {id: 5, from: 3, to: 3, title: 'score=1 \n method=default'}
    ]
    const edges = new vis.DataSet(rawEdge);
    console.log(this.traceGraph)
    const data = {
      nodes: nodes,
      edges: edges
    };

    const options = {
      width: '100%',
      height: '400px',
      interaction: {
        hoverConnectedEdges: false,
        hover: true
      },
      edges: {
        color: {
          hover: '#1e841d',
        },
      }
    };
    const network = new vis.Network(this.traceGraph.nativeElement, data, options);
    network.on('selectNode', (params) => {
      console.log('pre node=', this.selectedNode);
      this.selectedNode = nodes.get(params.nodes[0]);
      console.log('node=', this.selectedNode);
      const edgeIds = params.edges
      this.selectedNodeEdges = []
      for (const id of edgeIds) {
        this.selectedNodeEdges.push(edges.get(id));
      }
      console.log('edges=', this.selectedNodeEdges);
    });
  }
}
