import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Vertex} from '../../data-structure/vertex';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {FlatLabelAttNames} from '../../data-structure/LabelAttribModels';
import {of} from 'rxjs/observable/of';

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
    let httpParam = new HttpParams();
    httpParam = httpParam.append('labels', labels);
    const vertices = this.http.get<Vertex[]>(url, {params: httpParam});
    return vertices;
  }

  getAttribs(labels): Observable<FlatLabelAttNames[]> {
    const url = 'http://localhost:8080/TraceQueryEngine-1.0-SNAPSHOT//api/getAttribs';
    let httpParam = new HttpParams();
    httpParam = httpParam.append('labels', labels);
    const labelAttribPairObsv = this.http.get<FlatLabelAttNames[]>(url, {params: httpParam});
    return labelAttribPairObsv;
  }
}
