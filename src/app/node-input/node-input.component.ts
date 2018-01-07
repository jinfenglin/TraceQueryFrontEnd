import {Component, OnInit} from '@angular/core';
import {InputDisplayBridgeService} from '../services/input-display-bridge/input-display-bridge.service';
import {Router} from '@angular/router';
import {LabelAttribCondition} from '../data-structure/LabelAttribModels';
import {VertexProviderService} from "../services/vertex-provider/vertex-provider.service";

@Component({
  selector: 'app-node-input',
  templateUrl: './node-input.component.html',
  styleUrls: ['./node-input.component.css']
})
export class NodeInputComponent implements OnInit {
  traceDynoEnabled = false;
  sourceVertices: LabelAttribCondition[];
  targetVertices: LabelAttribCondition[];


  constructor(private bridge: InputDisplayBridgeService, private router: Router, private vertexProvider: VertexProviderService) {
    this.sourceVertices = [];
    this.targetVertices = [];
  }

  ngOnInit() {
  }

  receiveSources(income: LabelAttribCondition[]): void {
    this.sourceVertices = income;
  }

  receiveTarget(income: LabelAttribCondition[]): void {
    this.targetVertices = income;
  }

  clickSubmit(): void {
    console.log('Conditions submitted:', this.sourceVertices, this.targetVertices)
    this.bridge.addSourceTarget([this.sourceVertices, this.targetVertices]);
    this.router.navigateByUrl('traceGraph');
  }
}
