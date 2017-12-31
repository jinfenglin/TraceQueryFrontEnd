import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Vertex} from '../data-structure/vertex';
import {of} from 'rxjs/observable/of';

@Injectable()
export class VertexProviderService {

  constructor() {
  }

  /**
   * Get vetices under a certain label
   * @param labels
   * @returns {any}
   */
  getVertices(labels): Observable<Vertex[]> {
    const vertices: Vertex[] = [
      {id: '1', content: 'foo', label: 'Apple'},
      {id: '2', content: 'bar', label: 'Lime'},
      {id: '3', content: 'foobar', label: 'Lemon'}];

    return of(vertices);
  }
}
