import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {VertexProviderService} from '../../../services/vertex-provider/vertex-provider.service';
import * as vis from 'vis';

@Component({
  selector: 'app-tim-visual',
  templateUrl: './tim-visual.component.html',
  styleUrls: ['./tim-visual.component.css']
})
export class TimVisualComponent implements OnInit, AfterViewInit {
  @ViewChild('TIMGraph') TIMGraphe;
  nodes: any;
  edges: any;

  constructor(private verticesProvier: VertexProviderService) {
    this.nodes = new vis.DataSet();
    this.edges = new vis.DataSet();
    const timObs = verticesProvier.getTIM();
    timObs.subscribe(timObj => {
        const graphData = timObj['graph'];
        this.createGraph(graphData);
      }
    );
  }

  private createGraph(graph: any): void {
    const nodeBook = new Map<string, number>();
    const edgeBook = new Map<number, Set<number>>();
    let cnt = 0;
    // Register the node first then create the graph
    for (const artifType of Object.keys(graph)) {
      const linkedArtifs: string[] = graph[artifType];
      if (!nodeBook.has(artifType)) {
        this.nodes.add({id: cnt, label: artifType});
        edgeBook.set(cnt, new Set());
        nodeBook.set(artifType, cnt++);
      }
      // Deal with the links
      for (const linkedArtif of linkedArtifs) {
        if (!nodeBook.has(linkedArtif)) {
          this.nodes.add({id: cnt, label: linkedArtif});
          edgeBook.set(cnt, new Set());
          nodeBook.set(linkedArtif, cnt++);
        }
        const edgeEndId1 = nodeBook.get(artifType);
        const edgeEndId2 = nodeBook.get(linkedArtif);
        const forwardEdge = {from: edgeEndId1, to: edgeEndId2};
        const backEdge = {from: edgeEndId2, to: edgeEndId1};
        if (!this.hasEdge(edgeBook, forwardEdge) && !this.hasEdge(edgeBook, backEdge)) {
          edgeBook.get(edgeEndId1).add(edgeEndId2);
          this.edges.add(forwardEdge);
        }
      }
    }
  }

  hasEdge(edgeBook: Map<number, Set<number>>, edge: any): boolean {
    return edgeBook.get(edge.from).has(edge.to);
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    const data = {
      nodes: this.nodes,
      edges: this.edges
    };
    const options = {}
    const network = new vis.Network(this.TIMGraphe.nativeElement, data, options);
  }
}
