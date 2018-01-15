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
  visNodeBook: Map<number, VisNode>; // quick access for visNode through visId
  nodeCnt: number;
  extendedEdges: QueryEdge[];
  reducedLinks: Set<VisEdge>;

  constructor(private bridge: InputDisplayBridgeService,
              private traceProvider: TraceQueryService,
              private vertexProvider: VertexProviderService) {
    this.nodeBook = new Map<string, number>();
    this.visNodeBook = new Map<number, VisNode>();
    this.links = [];
    this.nodes = [];
    this.allVertices = new Map();
    this.extendedEdges = [];
    this.reducedLinks = new Set<VisEdge>();
    this.bridge.getQueryPath().subscribe(queryPath => this.queryEdges = queryPath);
    this.bridge.getColorBook().subscribe(book => this.colorBook = book);
    this.nodeCnt = 0;
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

  private TIM_DFS(curNode: string, queryGraph: Map<string, string[]>, timGraph: Map<string, string[]>, curPath: string[]) {
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
        this.TIM_DFS(nextNode, queryGraph, timGraph, curPath);
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

  private updateLac(label: string) {
    if (!this.lacs.has(label)) {
      this.lacs.set(label, new LabelAttribCondition(label, new Map<string, string>()));
    }
  }

  ngAfterViewInit() {
    this.vertexProvider.getTIM().subscribe(tim => {
      // Extend the query Path
      const timGraph = this.objectToGraph(tim['graph']);
      const queryGraph: Map<string, string[]> = this.buildQueryGraph(this.queryEdges);
      const waiting_set = new Set<string>();
      const waiting_array = Array.from(queryGraph.keys());
      queryGraph.forEach((connected, node) => waiting_set.add(node));
      while (waiting_set.size > 0) {
        const curNode = waiting_array.pop();
        this.TIM_DFS(curNode, queryGraph, timGraph, [curNode]);
        waiting_set.delete(curNode);
      }
      this.removeDuplication();
      // Get all conditions from bridge service then use the condition to get vertex
      this.bridge.getLabelAttribConditions().subscribe(st => {
          this.lacs = st;
          // Update the vertices that will be used
          for (const queryEdge of this.extendedEdges) {
            this.updateLac(queryEdge.sourceLabel);
            this.updateLac(queryEdge.targetLabel);
          }
          this.vertexProvider.getVertices(Array.from(this.lacs.values())).subscribe(d => {
              for (const vtx of d) {
                this.allVertices.set(vtx.dbId, vtx);
              }
              // Graph data preparation
              const obs: Observable<Edge[]> [] = [];
              for (const queryEdge of this.extendedEdges) {
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
                const graph = this.toVis(tmp);
                this.searchPath(graph);
                const reducedNodes = new Set<VisNode>();
                this.reducedLinks.forEach((edge) => {
                  reducedNodes.add(this.visNodeBook.get(edge.from));
                  reducedNodes.add(this.visNodeBook.get(edge.to));
                })
                // this.drawGraph(this.nodes, this.links);
                this.drawGraph(Array.from(reducedNodes), Array.from(this.reducedLinks));
              });
            }
          );
        }
      );
    });
  }

  private searchPath(graph: Map<number, VisEdge[]>): void {
    const startLabel = 'Code';
    const endLabel = 'Improvement';
    const startNodes = this.nodes.filter(node => node.label === startLabel);
    const curLabels = new Set<string>(); // Labels included already, don't need loop in label level
    for (const node of startNodes) {
      this.nodeDFS(node, endLabel, curLabels, [], graph);
    }
  }

  private nodeDFS(node: VisNode, endLabel: string, curLabels: Set<string>,
                  curPath: VisEdge[], graph: Map<number, VisEdge[]>) {
    if (node.label === endLabel) {
      for (const edge of curPath) {
        this.reducedLinks.add(edge);
      }
      return;
    }

    for (const edge of graph.get(node.id)) {
      const connectedNode = this.visNodeBook.get(this.getConnectedNodeId(edge, node.id));
      if (curLabels.has(connectedNode.label)) {
        continue;
      }
      curLabels.add(connectedNode.label);
      curPath.push(edge);
      this.nodeDFS(connectedNode, endLabel, curLabels, curPath, graph);
      curLabels.delete(connectedNode.label);
      curPath.pop();
    }
  }

  private getConnectedNodeId(edge: VisEdge, nodeId: number) {
    if (edge.from !== nodeId) {
      return edge.from;
    } else {
      return edge.to;
    }
  }

  registNodeAndGetVisId(dbId: string): number {
    if (!this.nodeBook.has(dbId)) {
      const vtx: Vertex = this.allVertices.get(dbId);
      this.nodeBook.set(dbId, this.nodeCnt++);
      const visId = this.nodeBook.get(dbId);
      const visNode = {id: visId, label: vtx.artifType, vertex: vtx, color: this.colorBook.get(vtx.artifType)};
      this.nodes.push(visNode);
      this.visNodeBook.set(visId, visNode);
    }
    return this.nodeBook.get(dbId);
  }

  toVis(rawEdges: Edge[]): Map<number, VisEdge[]> {
    const graph = new Map<number, VisEdge[]>();
    for (const rawEdge of rawEdges) {
      const sourceVisId = this.registNodeAndGetVisId(rawEdge.sourceDbId);
      const targetVisId = this.registNodeAndGetVisId(rawEdge.targetDbId);
      const title = 'Method:' + rawEdge.method + ' Score:' + rawEdge.score;
      const visLink: VisEdge = {id: this.links.length, from: sourceVisId, to: targetVisId, title: title, edge: rawEdge};
      this.links.push(visLink);
      if (!graph.has(sourceVisId)) {
        graph.set(sourceVisId, []);
      }
      if (!graph.has(targetVisId)) {
        graph.set(targetVisId, []);
      }
      graph.get(sourceVisId).push(visLink);
      graph.get(targetVisId).push(visLink);
    }
    return graph;
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
