import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Vertex} from '../../data-structure/vertex';
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
      {id: '3', content: 'foobar', label: 'Lemon'},
      {id: '4', content: 'foobar', label: 'Lemon'},
      {id: '5', content: 'foobar', label: 'Lemon'},
      {id: '6', content: 'foobar', label: 'Lemon'},
      {id: '7', content: 'foobar', label: 'Lemon'},
      {id: '8', content: 'foobar', label: 'Lemon'},
      {id: '9', content: 'foobar', label: 'Lemon'},
      {id: '10', content: 'foobar', label: 'Lemon'},
    ];

    return of(vertices);
  }
}
