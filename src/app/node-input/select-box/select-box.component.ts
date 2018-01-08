import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {MatChipInputEvent} from '@angular/material';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Vertex} from '../../data-structure/vertex';
import {VertexProviderService} from '../../services/vertex-provider/vertex-provider.service';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import {FlatLabelAttNames, LabelAttribCondition} from '../../data-structure/LabelAttribModels';
@Component({
  selector: 'app-select-box',
  templateUrl: './select-box.component.html',
  styleUrls: ['./select-box.component.css']
})
export class SelectBoxComponent implements OnInit {
  verticesRepo: Vertex[]; // The vertices selected after applying the conditions
  separatorKeysCodes = [ENTER, COMMA];
  inputVals: Map<string, Map<string, string>>;
  dataSource: FlatLabelAttribDataSource;
  idTable: any;

  @Output()
  reportCondition: EventEmitter<LabelAttribCondition[]> =
    new EventEmitter<LabelAttribCondition[]>(); // Report the selected vertices to the parent components

  constructor(private vertexProvider: VertexProviderService) {
    this.inputVals = new Map<string, Map<string, string>>();
    this.idTable = {};
    this.dataSource = new FlatLabelAttribDataSource(this.vertexProvider.getAttribs(this.getLabels()));
  }

  ngOnInit() {
  }

  toLabelAttribCondition(conditions: Map<string, Map<string, string>>): LabelAttribCondition[] {
    const rs: LabelAttribCondition[] = [];
    for (const label of Array.from(conditions.keys())) {
      const lac = new LabelAttribCondition(label, conditions.get(label));
      rs.push(lac);
    }
    return rs;
  }

  previewCondition(): void {
    this.vertexProvider.getVertices(this.toLabelAttribCondition(this.inputVals)).subscribe(vs => {
      this.verticesRepo = vs;
    });
  }

  addLabel(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our label
    const label = (value).trim();
    if (label.length > 0) {
      if (!(this.inputVals.has(label))) {
        this.inputVals.set(label, new Map<string, string>());
        console.log('Current inputvals:', this.inputVals);
        this.updateDataSource();
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.reportCondition.emit(this.toLabelAttribCondition(this.inputVals));
  }

  removeLabel(label: any): void {
    if (this.inputVals.has(label)) {
      this.inputVals.delete(label);
      this.updateDataSource();
    }
    this.reportCondition.emit(this.toLabelAttribCondition(this.inputVals));
  }

  updateInput($event): void {
    const id = $event.target.id;
    const label_AttName = this.fromId(id);
    const label = label_AttName['label'];
    const attribName = label_AttName['attribName'];
    const value = $event.target.value;
    if (!this.inputVals.has(label)) {
      this.inputVals.set(label, new Map<string, string>());
    }
    this.inputVals.get(label).set(attribName, value);
    this.reportCondition.emit(this.toLabelAttribCondition(this.inputVals));
  }

  updateDataSource(): void {
    this.dataSource = new FlatLabelAttribDataSource(this.vertexProvider.getAttribs(this.getLabels()));
  }

  toId(label: string, attribName: string): string {
    const id = label + attribName;
    this.idTable[id] = {label: label, attribName: attribName};
    return id;
  }

  fromId(id: string): {
    label: string, attribName: string
  } {
    return this.idTable[id];
  }

  getLabels(): string[] {
    return Array.from(this.inputVals.keys());
  }
}

export class FlatLabelAttribDataSource extends DataSource<FlatLabelAttNames> {

  constructor(private source: Observable<FlatLabelAttNames[]>) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<FlatLabelAttNames[]> {
    return this.source;
  }

  disconnect(collectionViewer: CollectionViewer): void {
    return;
  }
}
