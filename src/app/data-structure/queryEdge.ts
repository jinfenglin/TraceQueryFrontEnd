export class QueryEdge {
  sourceLabel: string;
  targetLabel: string;

  constructor(sourceLabel: string, targetLabel: string) {
    this.sourceLabel = sourceLabel;
    this.targetLabel = targetLabel;
  }
}
