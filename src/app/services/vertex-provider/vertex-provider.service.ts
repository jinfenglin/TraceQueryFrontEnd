import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Vertex} from '../../data-structure/vertex';
import {of} from 'rxjs/observable/of';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class VertexProviderService {
  constructor(private http: HttpClient) {

  }

  /**
   * Get vetices under a certain label
   * @param labels
   * @returns {any}
   */
  getVertices(labels): Observable<Vertex[]> {
    const url = 'http://localhost:8080/TraceQueryEngine-1.0-SNAPSHOT/';
    this.http.get(url).subscribe(data => {
      const testResponse = data;
      console.log('I SEE DATA HERE: ', testResponse);
    });



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
