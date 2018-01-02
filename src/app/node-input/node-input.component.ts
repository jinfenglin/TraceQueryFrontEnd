import {Component, OnInit} from '@angular/core';
import {} from '@angular/material';
import {Vertex} from '../data-structure/vertex';
import {InputDisplayBridgeService} from "../services/input-display-bridge/input-display-bridge.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-node-input',
  templateUrl: './node-input.component.html',
  styleUrls: ['./node-input.component.css']
})
export class NodeInputComponent implements OnInit {
  traceDynoEnabled = false;
  sourceVertices: Vertex[];
  targetVertices: Vertex[];


  constructor(private bridge: InputDisplayBridgeService, private router: Router) {
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

  clickSubmit(): void {
    this.bridge.addSourceTarget([this.sourceVertices, this.targetVertices]);
    this.router.navigateByUrl('traceGraph');
  }

}
