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
  labels = ['Improvement']; // Labels added by the user
  verticesRepo: Vertex[]; // The vertices selected after applying the conditions
  separatorKeysCodes = [ENTER, COMMA];
  inputVals: Map<string, Map<string, string>>;
  dataSource: FlatLabelAttribDataSource;

  idTable: any;

  @Output()
  reportSelected: EventEmitter<Vertex[]> = new EventEmitter<Vertex[]>(); // Report the selected vertices to the parent components

  constructor(private vertexProvider: VertexProviderService) {
    this.dataSource = new FlatLabelAttribDataSource(this.vertexProvider.getAttribs(this.labels));
    this.inputVals = new Map<string, Map<string, string>>();
    this.idTable = {};
  }

  ngOnInit() {
  }

  getVertices(): void {
    this.vertexProvider.getVertices(this.labels, this.inputVals).subscribe(vs => {
      this.verticesRepo = vs;
    });
  }

  addLabel(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

// Add our label
    if ((value || '').trim()) {
      if (!(this.labels.includes(value.trim()))) {
        this.labels.push(value.trim());
        this.updateDataSource();
      }
    }

// Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeLabel(label: any): void {
    const index = this.labels.indexOf(label);
    if (index >= 0) {
      this.labels.splice(index, 1);
      this.updateDataSource();
    }
  }

  updateInput($event): void {
    console.log('event=', $event);
    const id = $event.target.id;
    const label_AttName = this.fromId(id);
    const label = label_AttName['label'];
    const attribName = label_AttName['attribName'];
    const value = $event.target.value;
    if (!this.inputVals.has(label)) {
      this.inputVals.set(label, new Map<string, string>());
    }
    this.inputVals.get(label).set(attribName, value);
    console.log(this.inputVals);
  }

  updateDataSource(): void {
    this.dataSource = new FlatLabelAttribDataSource(this.vertexProvider.getAttribs(this.labels));
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
