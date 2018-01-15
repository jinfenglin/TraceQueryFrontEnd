import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {InputDisplayBridgeService} from '../services/input-display-bridge/input-display-bridge.service';
import {TraceQueryService} from '../services/trace-query/trace-query.service';
import * as vis from 'vis';
import {VisNode} from '../data-structure/visNode';
import {VisEdge} from '../data-structure/visEdge';
import {LabelAttribCondition} from '../data-structure/LabelAttribModels';
import {Edge} from '../data-structure/edge';
import {VertexProviderService} from '../services/vertex-provider/vertex-provider.service';
import {Vertex} from '../data-structure/vertex';
import {QueryEdge} from '../data-structure/queryEdge';
import {Observable} from 'rxjs/Observable';
import {forkJoin} from 'rxjs/observable/forkJoin';

@Component({
  selector: 'app-trace-graph',
  templateUrl: './trace-graph.component.html',
  styleUrls: [
    './trace-graph.component.css',
  ]
})
export class TraceGraphComponent implements OnInit, AfterViewInit {
  lacs: Map<string, LabelAttribCondition>;
  colorBook: Map<string, string>;
  queryPath: QueryEdge[];
  allVertices: Map<string, Vertex>;
  @ViewChild('traceGraph') traceGraph;
  selectedNode: VisNode;
  selectedNodeEdges: VisEdge[];
  nodeBook: Map<string, number>; // Record dbId to numeric id used in graph and by VisEdge
  links: VisEdge[];
  nodes: VisNode[];
  nodeCnt: number;

  constructor(private bridge: InputDisplayBridgeService,
              private traceProvider: TraceQueryService,
              private vertexProvider: VertexProviderService) {
    this.nodeBook = new Map<string, number>();
    this.links = [];
    this.nodes = [];
    this.allVertices = new Map();
    // Get all conditions from bridge service then use the condition to get vertex
    this.bridge.getLabelAttribConditions().subscribe(st => {
        this.lacs = st;
        this.vertexProvider.getVertices(Array.from(this.lacs.values())).subscribe(d => {
            for (const vtx of d) {
              this.allVertices.set(vtx.dbId, vtx);
            }
          }
        );
      }
    );
    this.bridge.getQueryPath().subscribe(queryPath => this.queryPath = queryPath);
    this.bridge.getColorBook().subscribe(book => this.colorBook = book);
    this.nodeCnt = 0;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const obs: Observable<Edge[]> [] = [];
    for (const queryEdge of this.queryPath) {
      const sourceLac = this.lacs.get(queryEdge.sourceLabel);
      const targetLac = this.lacs.get(queryEdge.targetLabel);
      const linkObs = this.traceProvider.getTraceLinks(sourceLac, targetLac, this.bridge.getDynoUsage());
      obs.push(linkObs);
    }
    forkJoin(obs).subscribe(links => {
      let tmp = [];
      for (const edge of links) {
        tmp = tmp.concat(edge);
      }
      this.toVis(tmp);
      this.drawGraph(this.nodes, this.links);
    });
  }

  registNodeAndGetVisId(dbId: string): number {
    if (!this.nodeBook.has(dbId)) {
      const vtx: Vertex = this.allVertices.get(dbId);
      this.nodeBook.set(dbId, this.nodeCnt++);
      const visId = this.nodeBook.get(dbId);
      const visNode = {id: visId, label: vtx.artifType, vertex: vtx, color: this.colorBook.get(vtx.artifType)};
      this.nodes.push(visNode);
    }
    return this.nodeBook.get(dbId);
  }

  toVis(rawEdges: Edge[]): void {
    for (const rawEdge of rawEdges) {
      const sourceVisId = this.registNodeAndGetVisId(rawEdge.sourceDbId);
      const targetVisId = this.registNodeAndGetVisId(rawEdge.targetDbId);
      const title = 'Method:' + rawEdge.method + ' Score:' + rawEdge.score;
      const visLink: VisEdge = {id: this.links.length, from: sourceVisId, to: targetVisId, title: title, edge: rawEdge};
      this.links.push(visLink);
    }
  }

  drawGraph(visNodes: VisNode[], visEdges: VisEdge[]): void {
    const nodes = new vis.DataSet(visNodes);
    const edges = new vis.DataSet(visEdges);
    const data = {
      nodes: nodes,
      edges: edges
    };

    const options = {
      width: '100%',
      height: '100%',
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
      this.selectedNode = nodes.get(params.nodes[0]);
      const edgeIds = params.edges;
      this.selectedNodeEdges = [];
      for (const id of edgeIds) {
        this.selectedNodeEdges.push(edges.get(id));
      }
    });
  }
}
