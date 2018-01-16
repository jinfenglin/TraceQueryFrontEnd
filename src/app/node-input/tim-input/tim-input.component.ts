import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import * as vis from 'vis';
import {MatDialog} from '@angular/material';
import {ConditionDialogComponent} from './condition-dialog/condition-dialog.component';
import {LabelAttribCondition} from '../../data-structure/LabelAttribModels';
import {QueryEdge} from '../../data-structure/queryEdge';

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
  labels: string[];
  lacs: Map<string, LabelAttribCondition>;
  queryPath: QueryEdge[];
  colorBook: Map<string, string>;
  startLabel: string;
  endLabel: string;

  @Output()
  reportConditions: EventEmitter<Map<string, LabelAttribCondition>> =
    new EventEmitter<Map<string, LabelAttribCondition>>(); // Notify parent what labels and attributes are selected

  @Output()
  reportQueryEdges: EventEmitter<QueryEdge[]> = new EventEmitter<QueryEdge[]>(); // Notify parent the path of query

  @Output()
  reportColorBook: EventEmitter<Map<string, string>> = new EventEmitter<Map<string, string>>();

  @Output()
  reprotStartEnd: EventEmitter<{ startLabel: string, endLabel: string }> = new EventEmitter();

  ngAfterViewInit(): void {
    this.draw();
  }

  constructor(public dialog: MatDialog) {
    this.lacs = new Map<string, LabelAttribCondition>();
    this.queryPath = [];
    this.colorBook = new Map<string, string>();
  }

  ngOnInit() {
  }

  draw(): void {
    this.nodes = new vis.DataSet();
    this.edges = new vis.DataSet();
    const data = {
      nodes: this.nodes,
      edges: this.edges
    };

    const options = {
      width: '100%',
      height: '100%',
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
      data: {labels: Array.from(this.labels)}
    });
    dialogRef.afterClosed().subscribe(result => {
        // result is an LabelAttCondi
        if (result === 'close') {
          return;
        }
        const lac: LabelAttribCondition = result.labelAttribs;
        const boxNode = {label: lac.label, labelAttribs: lac, color: result.color};
        // Don't allow duplicated label
        if (!this.lacs.has(lac.label)) {
          this.lacs.set(lac.label, lac);
          callback(boxNode);
          this.colorBook.set(lac.label, result.color);
          this.reportConditions.emit(this.lacs);
          this.reportColorBook.emit(this.colorBook);
          if (result.role === 'start') {
            this.startLabel = lac.label;
            this.reprotStartEnd.emit({startLabel: this.startLabel, endLabel: this.endLabel});
          } else if (result.role === 'end') {
            this.endLabel = lac.label;
            this.reprotStartEnd.emit({startLabel: this.startLabel, endLabel: this.endLabel});
          }
        }
      }
    );
  }

  updateNode(nodeId: number) {
    const graphNode = this.nodes.get(nodeId);
    const lac = graphNode['labelAttribs'];
    const originLabel = lac.label;
    console.log('read lac:', lac);
    let role = null;
    if (this.startLabel === lac.label) {
      role = 'start';
    }
    if (this.endLabel === lac.label) {
      role = 'end';
    }
    const dialogRef = this.dialog.open(ConditionDialogComponent, {
      width: '60%',
      height: '80%',
      data: {labels: this.labels, labelAttribs: lac, role: role}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'close') {
        return;
      }
      const res_lac: LabelAttribCondition = result.labelAttribs;
      if (result.role === 'start') {
        this.startLabel = res_lac.label;
        this.reprotStartEnd.emit({startLabel: this.startLabel, endLabel: this.endLabel});
      } else if (result.role === 'end') {
        this.endLabel = res_lac.label;
        this.reprotStartEnd.emit({startLabel: this.startLabel, endLabel: this.endLabel});
      }
      if (res_lac.label === originLabel || !this.lacs.has(res_lac.label)) {
        if (res_lac.label !== originLabel) {
          // Update links which connect the node
          for (const queryEdge of this.queryPath) {
            if (queryEdge.targetLabel === originLabel) {
              queryEdge.targetLabel = res_lac.label;
            }
            if (queryEdge.sourceLabel === originLabel) {
              queryEdge.sourceLabel = res_lac.label;
            }
          }
          // Remove the origin info
          this.lacs.delete(originLabel);
          this.lacs.set(res_lac.label, res_lac);
        }
        this.nodes.update({id: nodeId, label: res_lac.label, labelAttribs: res_lac, color: result.color});
        this.reportConditions.emit(this.lacs);
        this.colorBook.set(res_lac.label, result.color);
      }
    });
  }

  addEdge(data, callback) {
    const fromNode = this.nodes.get(data.from);
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

  receiveLabels(labels: string[]): void {
    this.labels = labels;
  }
}
