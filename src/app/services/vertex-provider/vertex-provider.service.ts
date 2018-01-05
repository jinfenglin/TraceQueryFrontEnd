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
  getVertices(labels: string[], conditions: Map<string, Map<string, string>>): Observable<Vertex[]> {
    const url = 'http://localhost:8080/TraceQueryEngine-1.0-SNAPSHOT/';
    let httpParam = new HttpParams();

    const ls: LabelAttribCondition[] = [];
    for (const label of Array.from(conditions.keys())) {
      const lac = new LabelAttribCondition(label, conditions.get(label));
      ls.push(lac);
    }
    httpParam = httpParam.append('labels', JSON.stringify(labels));
    httpParam = httpParam.append('conditions', JSON.stringify(ls));
    console.log("conditions:", JSON.stringify(ls))
    const vertices = this.http.get<Vertex[]>(url, {params: httpParam});
    vertices.subscribe(data => console.log(data));
    return vertices;
  }

  getAttribs(labels): Observable<FlatLabelAttNames[]> {
    const url = 'http://localhost:8080/TraceQueryEngine-1.0-SNAPSHOT//api/getAttribs';
    let httpParam = new HttpParams();
    httpParam = httpParam.append('labels', labels);
    const labelAttribPairObsv = this.http.get<FlatLabelAttNames[]>(url, {params: httpParam});
    labelAttribPairObsv.subscribe(data => console.log(data));
    return labelAttribPairObsv;
  }
}
