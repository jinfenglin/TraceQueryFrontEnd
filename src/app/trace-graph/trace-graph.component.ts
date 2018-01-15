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
  queryEdges: QueryEdge[];
  allVertices: Map<string, Vertex>;
  @ViewChild('traceGraph') traceGraph;
  selectedNode: VisNode;
  selectedNodeEdges: VisEdge[];
  nodeBook: Map<string, number>; // Record dbId to numeric id used in graph and by VisEdge
  links: VisEdge[];
  nodes: VisNode[];
  nodeCnt: number;
  tim: any;
  extendedEdges: QueryEdge[];

  constructor(private bridge: InputDisplayBridgeService,
              private traceProvider: TraceQueryService,
              private vertexProvider: VertexProviderService) {
    this.nodeBook = new Map<string, number>();
    this.links = [];
    this.nodes = [];
    this.allVertices = new Map();
    this.extendedEdges = [];
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
    this.bridge.getQueryPath().subscribe(queryPath => this.queryEdges = queryPath);
    this.bridge.getColorBook().subscribe(book => this.colorBook = book);
    // this.extendQueryEdges();
    this.nodeCnt = 0;
  }

  private extendQueryEdges() {
    this.vertexProvider.getTIM().subscribe(tim => {
      const timGraph = this.objectToGraph(tim['graph']);
      const queryGraph: Map<string, string[]> = this.buildQueryGraph(this.queryEdges);
      const waiting_set = new Set<string>();
      const waiting_array = Array.from(queryGraph.keys());
      queryGraph.forEach((connected, node) => waiting_set.add(node));
      while (waiting_set.size > 0) {
        const curNode = waiting_array.pop();
        this.DFS(curNode, queryGraph, timGraph, [curNode]);
        waiting_set.delete(curNode);
      }
      this.removeDuplication();
    });
  }

  private buildQueryGraph(queryEdges: QueryEdge[]): Map<string, string[]> {
    const queryGraph = new Map<string, string[]>();
    for (const edge of queryEdges) {
      if (!queryGraph.has(edge.sourceLabel)) {
        queryGraph.set(edge.sourceLabel, []);
      }
      if (!queryGraph.has(edge.targetLabel)) {
        queryGraph.set(edge.targetLabel, []);
      }
      queryGraph.get(edge.sourceLabel).push(edge.targetLabel);
      queryGraph.get(edge.targetLabel).push(edge.sourceLabel);
    }
    return queryGraph;
  }

  private pathToQueryEdges(path: string[]): QueryEdge[] {
    const queryPath = [];
    for (let i = 1; i < path.length; i++) {
      queryPath.push(new QueryEdge(path[i - 1], path[i]));
    }
    return queryPath;
  }

  private objectToGraph(graph: any) {
    const timGraph = new Map<string, string[]>();
    for (const artifType of Object.keys(graph)) {
      const linkedArtifs: string[] = graph[artifType];
      timGraph.set(artifType, linkedArtifs);
    }
    return timGraph;
  }

  private DFS(curNode: string, queryGraph: Map<string, string[]>, timGraph: Map<string, string[]>, curPath: string[]) {
    for (const nextNode of timGraph.get(curNode)) {
      if (curPath.includes(nextNode)) {
        continue;
      }
      if (queryGraph.has(nextNode)) {
        curPath.push(nextNode);
        this.extendedEdges = this.extendedEdges.concat(this.pathToQueryEdges(curPath));
        curPath.pop();
      } else {
        curPath.push(nextNode);
        this.DFS(nextNode, queryGraph, timGraph, curPath);
        curPath.pop();
      }
    }
  }

  private removeDuplication() {
    const reducedEdges: QueryEdge[] = [];
    const records = new Map<string, string[]>();
    for (const edge of this.extendedEdges) {
      if (!records.has(edge.sourceLabel)) {
        records.set(edge.sourceLabel, []);
      }
      if (!records.has(edge.targetLabel)) {
        records.set(edge.targetLabel, []);
      }
      if (!records.get(edge.sourceLabel).includes(edge.targetLabel) && !records.get(edge.sourceLabel).includes(edge.targetLabel)) {
        records.get(edge.sourceLabel).push(edge.targetLabel);
        records.get(edge.targetLabel).push(edge.sourceLabel);
        reducedEdges.push(edge);
      }
    }
    this.extendedEdges = reducedEdges;
  }

  ngOnInit() {
  }

  /**
   * After extendsion, not all nodes in the query edge can find its lac in collected lacs
   * @param edgeEndLabel
   * @returns {LabelAttribCondition}
   */
  private getLacsForQueryEdge(edgeEndLabel: string): LabelAttribCondition {
    let lac = new LabelAttribCondition(edgeEndLabel, new Map<string, string>());
    if (this.lacs.has(edgeEndLabel)) {
      lac = this.lacs.get(edgeEndLabel);
    }
    return lac;
  }

  ngAfterViewInit() {
    const obs: Observable<Edge[]> [] = [];
    this.extendQueryEdges();
    for (const queryEdge of this.extendedEdges) {
      const sourceLac = this.getLacsForQueryEdge(queryEdge.sourceLabel);
      const targetLac = this.getLacsForQueryEdge(queryEdge.targetLabel);
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
