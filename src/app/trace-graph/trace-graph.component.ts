import {Component, OnInit} from '@angular/core';
import {InputDisplayBridgeService} from '../services/input-display-bridge/input-display-bridge.service';
import {Vertex} from '../data-structure/vertex';
import {TraceQueryService} from '../services/trace-query/trace-query.service';

declare var acl: any;
@Component({
  selector: 'app-trace-graph',
  templateUrl: './trace-graph.component.html',
  styleUrls: ['./trace-graph.component.css']
})
export class TraceGraphComponent implements OnInit {
  sourceAndTarget: Vertex[][];

  constructor(private bridge: InputDisplayBridgeService, private traceProvider: TraceQueryService) {
    this.bridge.getSourceTarget().subscribe(st => this.sourceAndTarget = st);
    const res = traceProvider.getJsonResult(this.sourceAndTarget[0], this.sourceAndTarget[1]);

    const config = {
      dataSource: res,
    };
    acl.begin({'dataSource': config});
  }

  ngOnInit() {
  }


}
