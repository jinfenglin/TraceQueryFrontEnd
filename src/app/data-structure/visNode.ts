import {Vertex} from './vertex';

export class VisNode {
  id: number; // Vis id used by visjs
  label: string;
  color: string;
  vertex: Vertex; // The caption used in the graph
  level: number;
}
