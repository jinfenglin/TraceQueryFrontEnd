import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {QueryEdge} from '../../data-structure/queryEdge';
import {LabelAttribCondition} from '../../data-structure/LabelAttribModels';
import {Vertex} from '../../data-structure/vertex';


@Injectable()
export class InputDisplayBridgeService {
  labelAndConditions: LabelAttribCondition[];
  traecDynoEnabled: boolean;
  vertices: Vertex[];
  queryPath: QueryEdge[];

  constructor() {
    this.labelAndConditions = [];
    this.queryPath = [];
  }

  getLabelAttribConditions(): Observable<LabelAttribCondition[]> {
    return of(this.labelAndConditions);
  }

  addLabelAttribConditions(data: LabelAttribCondition[]): void {
    this.labelAndConditions = data;
  }

  setDynoUsage(traceDynoEnabled: boolean) {
    this.traecDynoEnabled = traceDynoEnabled;
  }

  getDynoUsage() {
    return this.traecDynoEnabled;
  }

  addQueryPath(queryPath: QueryEdge[]) {
    this.queryPath = queryPath;
  }

  getQueryPath(): Observable<QueryEdge[]> {
    return of(this.queryPath);
  }

}
