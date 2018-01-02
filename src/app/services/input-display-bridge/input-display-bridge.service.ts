import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Vertex} from '../../data-structure/vertex';
import {of} from 'rxjs/observable/of';

@Injectable()
export class InputDisplayBridgeService {
  data: Vertex[][];

  constructor() {
    this.data = [];
  }

  getSourceTarget(): Observable<Vertex[][]> {
    return of(this.data);
  }

  addSourceTarget(data: Vertex[][]): void {
    this.data = data;
  }

}
