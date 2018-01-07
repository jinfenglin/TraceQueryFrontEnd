import {Injectable} from '@angular/core';
import {Edge} from '../../data-structure/edge';
import {HttpClient, HttpParams} from '@angular/common/http';
import {LabelAttribCondition} from '../../data-structure/LabelAttribModels';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class TraceQueryService {
  constructor(private http: HttpClient) {
  }

  getTraceLinks(source: LabelAttribCondition, target: LabelAttribCondition): Observable<Edge[]> {
    const url = 'http://localhost:8080/TraceQueryEngine-1.0-SNAPSHOT/api/getTraceLinks';
    let httpParam = new HttpParams();
    httpParam = httpParam.append('source', JSON.stringify(source));
    httpParam = httpParam.append('target', JSON.stringify(target));
    const links = this.http.get<Edge[]>(url, {params: httpParam});
    links.subscribe(data => console.log('Trace link for', source.label, 'and', target.label, ':', data));
    return links;
  }
}
