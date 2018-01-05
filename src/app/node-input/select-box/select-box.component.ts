import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {MatChipInputEvent, MatTableDataSource} from '@angular/material';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Vertex} from '../../data-structure/vertex';
import {VertexProviderService} from '../../services/vertex-provider/vertex-provider.service';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import {FlatLabelAttNames} from '../../data-structure/LabelAttribModels';
@Component({
  selector: 'app-select-box',
  templateUrl: './select-box.component.html',
  styleUrls: ['./select-box.component.css']
})
export class SelectBoxComponent implements OnInit {
  labels = ['Improvement']; // Labels added by the user
  vertices_repo: Vertex[]; // The vertices selected after applying the conditions
  separatorKeysCodes = [ENTER, COMMA];
  inputVals: any;
  dataSource: FlatLabelAttribDataSource;

  @Output()
  reportSelected: EventEmitter<Vertex[]> = new EventEmitter<Vertex[]>(); // Report the selected vertices to the parent components

  constructor(private vertexProvider: VertexProviderService) {
    this.getVertices();
    this.dataSource = new FlatLabelAttribDataSource(this.vertexProvider.getAttribs(this.labels));
    this.inputVals = {};
  }

  ngOnInit() {
  }

  getVertices(): void {
    this.vertexProvider.getVertices(this.labels).subscribe(vs => {
      console.log('get vertices from service:', vs);
      this.vertices_repo = vs;
      console.log('vertice_repo=', this.vertices_repo);
    });
  }

  addLabel(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our label
    if ((value || '').trim()) {
      if (!(this.labels.includes(value.trim()))) {
        this.labels.push(value.trim());
        // this.vertexProvider.getAttribs([value.trim()]).subscribe(labelAttNameList => this.addFlatAttribForMultiLables(labelAttNameList));
        this.dataSource = new FlatLabelAttribDataSource(this.vertexProvider.getAttribs(this.labels));
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
      this.dataSource = new FlatLabelAttribDataSource(this.vertexProvider.getAttribs(this.labels));
    }
  }

  updateInput($event): void {
    console.log('event=', $event);
    const id = $event.target.id;
    this.inputVals[id] = $event.target.value;
    console.log('name:', id, '|value', $event.target.value);
    console.log(this.inputVals);
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
