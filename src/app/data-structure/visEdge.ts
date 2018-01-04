import {Edge} from './edge';
export class VisEdge {
  id: number; // Id used by the visualization library should be a number
  title: string; // Title show on the edge when mouse hover
  from: number; // VisId of the source node
  to: number; // VisId of the target node
}
