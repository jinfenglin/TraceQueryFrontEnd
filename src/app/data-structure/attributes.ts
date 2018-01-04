export class Attributes {
  attribNames: string[];
  attribValues: string[];

  getValue(name: string): string {
    const index = this.attribNames.indexOf(name);
    if (index > 0) {
      return this.attribValues[index];
    } else {
      return null;
    }
  }
}
