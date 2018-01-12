import {Component, OnInit} from '@angular/core';
import {InputDisplayBridgeService} from '../services/input-display-bridge/input-display-bridge.service';
import {Router} from '@angular/router';
import {LabelAttribCondition} from '../data-structure/LabelAttribModels';
import {QueryEdge} from '../data-structure/queryEdge';

@Component({
  selector: 'app-node-input',
  templateUrl: './node-input.component.html',
  styleUrls: ['./node-input.component.css']
})
export class NodeInputComponent implements OnInit {
  traceDynoEnabled = false;
  lacs: Map<string, LabelAttribCondition>;
  queryPath: QueryEdge[];

  constructor(private bridge: InputDisplayBridgeService, private router: Router) {
    this.lacs = new Map < string, LabelAttribCondition >();
    this.queryPath = [];
  }

  ngOnInit() {
  }

  receiveLabelAttribConditions(income: Map<string, LabelAttribCondition>): void {
    this.lacs = income;
  }

  receiveQueryPath(queryPath: QueryEdge[]) {
    this.queryPath = queryPath;
  }


  clickSubmit(): void {
    console.log('Conditions submitted:', this.lacs, this.queryPath)
    this.bridge.addLabelAttribConditions(this.lacs);
    this.bridge.addQueryPath(this.queryPath);
    this.bridge.setDynoUsage(this.traceDynoEnabled);
    this.router.navigateByUrl('traceGraph');
  }
}
