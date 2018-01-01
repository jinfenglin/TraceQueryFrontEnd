import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {} from '@angular/material';
import {Vertex} from '../data-structure/vertex';

@Component({
  selector: 'app-node-input',
  templateUrl: './node-input.component.html',
  styleUrls: ['./node-input.component.css']
})
export class NodeInputComponent implements OnInit {
  traceDynoEnabled = false;
  sourceVertices: Vertex[];
  targetVertices: Vertex[];

  @Output()
  sourceToTarget: EventEmitter<Vertex[]> = new EventEmitter<Vertex[]>();

  constructor() {
    this.sourceVertices = [];
    this.targetVertices = [];
  }

  ngOnInit() {
  }

  receiveSources(income: Vertex[]): void {
    this.sourceVertices = income;
  }

  receiveTarget(income: Vertex[]): void {
    this.targetVertices = income;
  }

}
