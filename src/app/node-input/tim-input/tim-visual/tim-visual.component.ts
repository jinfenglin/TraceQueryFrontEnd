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

  private createNodeContent(id: number, artifType: string, attribs: string[]): any {
    let innerContentHtml = '<h3>' + artifType + '</h3>  <hr> <p>';
    for (const attrib of attribs) {
      innerContentHtml += attrib + '<br/>';
    }
    innerContentHtml += '</p>';

    const node = {
      id: id,
      label: artifType,
      shape: 'box',
      title: innerContentHtml
    }
    return node;
  }

  private registerNodeEdge(graph: any): { nodeBook: Map<string, number>; edgeBook: Map<number, Set<number>> } {
    const nodeBook = new Map<string, number>();
    const edgeBook = new Map<number, Set<number>>();
    let cnt = 0;
    // Register the node first then create the graph
    for (const artifType of Object.keys(graph)) {
      const linkedArtifs: string[] = graph[artifType];
      if (!nodeBook.has(artifType)) {
        edgeBook.set(cnt, new Set());
        nodeBook.set(artifType, cnt++);
      }
      // Deal with the links
      for (const linkedArtif of linkedArtifs) {
        if (!nodeBook.has(linkedArtif)) {
          edgeBook.set(cnt, new Set());
          nodeBook.set(linkedArtif, cnt++);
        }
        const edgeEndId1 = nodeBook.get(artifType);
        const edgeEndId2 = nodeBook.get(linkedArtif);
        const forwardEdge = {from: edgeEndId1, to: edgeEndId2};
        const backEdge = {from: edgeEndId2, to: edgeEndId1};
        if (!this.hasEdge(edgeBook, forwardEdge) && !this.hasEdge(edgeBook, backEdge)) {
          edgeBook.get(edgeEndId1).add(edgeEndId2);
        }
      }
    }
    return {nodeBook: nodeBook, edgeBook: edgeBook};
  }

  private createGraph(graph: any): void {
    const nodeEdgeInfo = this.registerNodeEdge(graph);
    const nodeBook = nodeEdgeInfo.nodeBook;
    const edgeBook = nodeEdgeInfo.edgeBook;
    this.verticesProvier.getAttribs(Array.from(nodeBook.keys())).subscribe(flatAttribs => {
      const labelAttribs = new Map<string, string[]>();
      for (const labelAttrib of flatAttribs) {
        const label = labelAttrib.label;
        const attrib = labelAttrib.attribName;
        if (!labelAttribs.has(label)) {
          labelAttribs.set(label, []);
        }
        labelAttribs.get(label).push(attrib);
      }
      for (const nodeLabel of Array.from(nodeBook.keys())) {
        const id = nodeBook.get(nodeLabel);
        const attribs = labelAttribs.get(nodeLabel);
        this.nodes.add(this.createNodeContent(id, nodeLabel, attribs));
      }
      for (const edgesFrom of Array.from(edgeBook.keys())) {
        const edgeToMap = edgeBook.get(edgesFrom);
        for (const edgeTo of Array.from(edgeToMap)) {
          this.edges.add({from: edgesFrom, to: edgeTo});
        }
      }
    });
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
    const options = {
      width: '100%',
      height: '100%',

    }
    const network = new vis.Network(this.TIMGraphe.nativeElement, data, options);
  }
}
