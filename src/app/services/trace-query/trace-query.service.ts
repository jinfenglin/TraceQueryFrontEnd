import {Injectable} from '@angular/core';
import {Vertex} from '../../data-structure/vertex';
import {Edge} from '../../data-structure/edge';

@Injectable()
export class TraceQueryService {
  json = '{"nodes": [{"caption": "foo1","type": "bar1","id": 1}, {"caption": "foo2","type": "bar2","id": 2},' +
    ' {"caption": "foo3","type": "bar3","id": 3}], "edges": [{"source": 1,"target": 2,"caption": "ACTED_IN"},' +
    '{"source": 2,"target": 3,"caption": "ACTED_IN"}]}';
  nodes: Vertex[] = [];

  links: Edge[] = [
    {id: '1', source: '1', target: '2', score: '1', method: 'default'},
    {id: '2', source: '2', target: '3', score: '1', method: 'default'},
    {id: '3', source: '2', target: '4', score: '1', method: 'default'},
    {id: '4', source: '3', target: '5', score: '1', method: 'default'},
    {id: '5', source: '3', target: '6', score: '1', method: 'default'},
    {id: '6', source: '4', target: '7', score: '1', method: 'default'},
    {id: '7', source: '4', target: '8', score: '1', method: 'default'},
  ];

  private getRawResult(source: Vertex[], target: Vertex[]): [Vertex[], Edge[]] {
    return [this.nodes, this.links];
  }

  getJsonResult(source: Vertex[], target: Vertex[]): string {
    return '';
  }

  constructor() {
  }

}
