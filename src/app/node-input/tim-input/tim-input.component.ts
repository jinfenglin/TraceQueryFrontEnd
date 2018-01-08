import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import * as vis from 'vis';
import {MatDialog} from "@angular/material";
import {ConditionDialogComponent} from "./condition-dialog/condition-dialog.component";
import {LabelAttribCondition} from "../../data-structure/LabelAttribModels";
import {QueryEdge} from "../../data-structure/queryEdge";
@Component({
  selector: 'app-tim-input',
  templateUrl: './tim-input.component.html',
  styleUrls: ['./tim-input.component.css']
})
export class TimInputComponent implements OnInit, AfterViewInit {
  @ViewChild('inputGraph') inputGraph;
  network: any;
  nodes: any;
  edges: any;

  lacs: Map<string, LabelAttribCondition>;
  queryPath: QueryEdge[];

  @Output()
  reportConditions: EventEmitter<LabelAttribCondition[]> =
    new EventEmitter<LabelAttribCondition[]>();

  @Output()
  reportQueryEdges: EventEmitter<QueryEdge[]> = new EventEmitter<QueryEdge[]>()

  ngAfterViewInit(): void {
    this.draw();
  }

  constructor(public dialog: MatDialog) {
    this.lacs = new Map<string, LabelAttribCondition>();
    this.queryPath = [];
  }

  ngOnInit() {
  }

  draw(): void {
    const nodesRaw = [];
    const edgeRaw = [];
    this.nodes = new vis.DataSet(nodesRaw);
    this.edges = new vis.DataSet(edgeRaw);
    const data = {
      nodes: this.nodes,
      edges: this.edges
    };

    const options = {
      width: '100%',
      height: '400px',
      interaction: {
        hoverConnectedEdges: false,
        hover: true
      },
      manipulation: {
        addNode: (data, callback) => {
          this.addNode(data, callback);
        },
        addEdge: (data, callback) => {
          this.addEdge(data, callback);
        },
        deleteEdge: (data, callback) => {
          this.deleteEdge(data, callback);
        },
        deleteNode: (data, callback) => {
          this.deleteNode(data, callback);
        }
      },

    };
    this.network = new vis.Network(this.inputGraph.nativeElement, data, options);
    this.network.on('doubleClick', (params) => {
      const nodeId = params['nodes'][0];
      this.updateNode(nodeId);
    });
  }

  addNode(data, callback) {
    const dialogRef = this.dialog.open(ConditionDialogComponent, {
      width: '60%',
      height: '80%',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      // result is an LabelAttCondi
      const boxNode = {label: result.label, labelAttribs: result};
      // Don't allow duplicated label
      if (!this.lacs.has(result.label) && result.label !== '') {
        this.lacs.set(result.label, result);
        callback(boxNode);
        this.reportConditions.emit(Array.from(this.lacs.values()));
      }
    });
  }

  updateNode(nodeId: number) {
    const graphNode = this.nodes.get(nodeId);
    const lac = graphNode['labelAttribs'];
    const originLabel = lac.label;
    const dialogRef = this.dialog.open(ConditionDialogComponent, {
      width: '60%',
      height: '80%',
      data: lac
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.label === originLabel || !this.lacs.has(result.label)) {
        if (result.label !== originLabel) {
          for (const queryEdge of this.queryPath) {
            if (queryEdge.targetLabel === originLabel) {
              queryEdge.targetLabel = result.label;
            }
            if (queryEdge.sourceLabel === originLabel) {
              queryEdge.sourceLabel = result.label;
            }
          }
        }
        this.nodes.update({id: nodeId, labelAttribs: result});
        this.reportConditions.emit(Array.from(this.lacs.values()));
      }
    });
  }

  addEdge(data, callback) {
    const fromNode = this.nodes.get(data.from)
    const toNode = this.nodes.get(data.to);
    const queryEdge = new QueryEdge(fromNode.label, toNode.label);
    console.log('queryEdge:', queryEdge);
    this.queryPath.push(queryEdge);
    callback(data);
    this.reportQueryEdges.emit(this.queryPath);
  }

  deleteEdge(data, callback) {
    const edgeId = data.edges[0];
    const edge = this.edges.get(edgeId);
    const fromLabel = this.nodes.get(edge.from).label;
    const toLabel = this.nodes.get(edge.to).label;
    this.queryPath = this.queryPath.filter(queryEdge => queryEdge.sourceLabel !== fromLabel || queryEdge.targetLabel !== toLabel);
    this.reportQueryEdges.emit(this.queryPath);
    callback(data);
  }

  deleteNode(data, callback) {
    const nodeId = data.nodes[0];
    const node = this.nodes.get(nodeId);
    const label = node.label;
    this.lacs.delete(label);
    this.queryPath = this.queryPath.filter(queryEdge =>
    queryEdge.targetLabel !== label && queryEdge.sourceLabel !== label);
    callback(data);
  }
}
