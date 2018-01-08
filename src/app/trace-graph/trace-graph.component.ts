import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {InputDisplayBridgeService} from '../services/input-display-bridge/input-display-bridge.service';
import {TraceQueryService} from '../services/trace-query/trace-query.service';
import * as vis from 'vis';
import {VisNode} from '../data-structure/visNode';
import {VisEdge} from '../data-structure/visEdge';
import {LabelAttribCondition} from '../data-structure/LabelAttribModels';
import {Edge} from '../data-structure/edge';
import {VertexProviderService} from '../services/vertex-provider/vertex-provider.service';
import {Vertex} from "../data-structure/vertex";
@Component({
  selector: 'app-trace-graph',
  templateUrl: './trace-graph.component.html',
  styleUrls: [
    './trace-graph.component.css',
  ]
})
export class TraceGraphComponent implements OnInit, AfterViewInit {
  sourceAndTarget: LabelAttribCondition[][];
  allVertices: Map<string, Vertex>;
  @ViewChild('traceGraph') traceGraph;
  selectedNode: VisNode;
  selectedNodeEdges: VisEdge[];
  nodeBook: Map<string, number>; // Record dbId to numeric id used in graph and by VisEdge
  verseNodeBook: Map<number, string>;
  links: VisEdge[];
  nodes: VisNode[];
  nodeCnt: number;

  constructor(private bridge: InputDisplayBridgeService,
              private traceProvider: TraceQueryService,
              private vertexProvider: VertexProviderService) {
    this.nodeBook = new Map<string, number>();
    this.verseNodeBook = new Map<number, string>();
    this.links = [];
    this.nodes = [];
    this.allVertices = new Map();
    // Get all conditions from bridge service then use the condition to get vertex
    this.bridge.getSourceTarget().subscribe(st => {
        this.sourceAndTarget = st;
        let allConds: LabelAttribCondition[] = st[0];
        allConds = allConds.concat(st[1]);
        console.log('all conditions:', allConds);
        this.vertexProvider.getVertices(allConds).subscribe(d => {
            for (const vtx of d) {
              this.allVertices.set(vtx.dbId, vtx);
            }
          }
        );
      }
    );
    this.nodeCnt = 0;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.traceProvider.getTraceLinks(this.sourceAndTarget[0][0], this.sourceAndTarget[1][0]).subscribe(l => {
        this.toVis(l);
        console.log('debug - nodes to draw:', this.nodes);
        console.log('debug - links to draw:', this.links);
        this.drawGraph(this.nodes, this.links);
      }
    );
  }

  registNodeAndGetVisId(dbId: string): number {
    if (!this.nodeBook.has(dbId)) {
      const label = this.allVertices.get(dbId).artifType;
      this.nodeBook.set(dbId, this.nodeCnt);
      this.verseNodeBook.set(this.nodeCnt, dbId);
      this.nodeCnt++;
      const visId = this.nodeBook.get(dbId);
      const visNode = {id: visId, label: label};
      this.nodes.push(visNode);
    }
    return this.nodeBook.get(dbId);
  }

  toVis(rawEdges: Edge[]): void {
    for (const rawEdge of rawEdges) {
      const sourceVisId = this.registNodeAndGetVisId(rawEdge.sourceDbId);
      const targetVisId = this.registNodeAndGetVisId(rawEdge.targetDbId);
      const title = 'Method:' + rawEdge.method + ' Score:' + rawEdge.score;
      const visLink: VisEdge = {id: this.links.length, from: sourceVisId, to: targetVisId, title: title};
      this.links.push(visLink);
    }
  }

  drawGraph(visNodes: VisNode[], visEdges: VisEdge[]): void {
    const nodes = new vis.DataSet(visNodes);
    const edges = new vis.DataSet(visEdges);
    console.log('VisNode:', visNodes);
    console.log('VisEdge:', visEdges);
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
      const edgeIds = params.edges;
      this.selectedNodeEdges = [];
      for (const id of edgeIds) {
        this.selectedNodeEdges.push(edges.get(id));
      }
      console.log('edges=', this.selectedNodeEdges);
    });
  }
}
