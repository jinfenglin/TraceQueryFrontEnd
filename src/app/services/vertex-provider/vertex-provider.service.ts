import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Vertex} from '../../data-structure/vertex';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {FlatLabelAttNames, LabelAttribCondition} from '../../data-structure/LabelAttribModels';

@Injectable()
export class VertexProviderService {
  constructor(private http: HttpClient) {

  }

  /**
   * Get vetices under a certain label
   * @param labels
   * @returns {any}
   */
  getVertices(conditions: LabelAttribCondition[]): Observable<Vertex[]> {
    const url = 'http://localhost:8080/TraceQueryEngine-1.0-SNAPSHOT/';
    let httpParam = new HttpParams();
    httpParam = httpParam.append('conditions', JSON.stringify(conditions));
    console.log('conditions:', JSON.stringify(conditions))
    const vertices = this.http.get<Vertex[]>(url, {params: httpParam});
    return vertices;
  }

  getAttribs(labels): Observable<FlatLabelAttNames[]> {
    const url = 'http://localhost:8080/TraceQueryEngine-1.0-SNAPSHOT/api/getAttribs';
    let httpParam = new HttpParams();
    httpParam = httpParam.append('labels', labels);
    const labelAttribPairObsv = this.http.get<FlatLabelAttNames[]>(url, {params: httpParam});
    labelAttribPairObsv.subscribe(data => console.log('Retrieved attributes for', labels, ':', data));
    return labelAttribPairObsv;
  }

  getVertexById(dbId: string): Vertex {
    const url = 'http://localhost:8080/TraceQueryEngine-1.0-SNAPSHOT/api/getVertex';
    let httpParam = new HttpParams();
    httpParam = httpParam.append('dbId', dbId);
    const vObs = this.http.get<Vertex>(url, {params: httpParam});
    let res: Vertex;
    vObs.subscribe(v => res = v);
    return res;
  }
}
