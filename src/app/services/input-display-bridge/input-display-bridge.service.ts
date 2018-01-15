import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {QueryEdge} from '../../data-structure/queryEdge';
import {LabelAttribCondition} from '../../data-structure/LabelAttribModels';
import {Vertex} from '../../data-structure/vertex';


@Injectable()
export class InputDisplayBridgeService {
  labelAndConditions: Map<string, LabelAttribCondition>;
  traecDynoEnabled: boolean;
  queryPath: QueryEdge[];
  colorBook: Map<string, string>;

  constructor() {
    this.labelAndConditions = new Map<string, LabelAttribCondition>();
    this.queryPath = [];
  }

  getLabelAttribConditions(): Observable<Map<string, LabelAttribCondition>> {
    return of(this.labelAndConditions);
  }

  addLabelAttribConditions(data: Map<string, LabelAttribCondition>): void {
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

  addColorBook(colorBook: Map<string, string>): void {
    this.colorBook = colorBook;
  }

  getColorBook(): Observable<Map<string, string>> {
    return of(this.colorBook);
  }
}
