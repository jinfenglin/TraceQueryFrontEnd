export class FlatLabelAttNames {
  label: string;
  attribName: string;
}

export class LabelAttribCondition {
  label: string;
  attribConditions: AttribCondition[];

  constructor(label: string, mapData: Map<string, string>) {
    this.attribConditions = [];
    this.label = label;
    for (const attribName of Array.from(mapData.keys())) {
      const attribCond = new AttribCondition(attribName, mapData.get(attribName));
      this.attribConditions.push(attribCond);
    }
  }
}

export class AttribCondition {
  attribName: string;
  condition: string;

  constructor(attribName: string, condition: string) {
    this.attribName = attribName;
    this.condition = condition;
  }
}
