import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {MatChipInputEvent, MatTableDataSource} from '@angular/material';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Vertex} from '../../data-structure/vertex';
import {VertexProviderService} from '../../services/vertex-provider/vertex-provider.service';
@Component({
  selector: 'app-select-box',
  templateUrl: './select-box.component.html',
  styleUrls: ['./select-box.component.css']
})
export class SelectBoxComponent implements OnInit {
  labels = ['Lemon', 'Lime', 'Apple'];
  available_vertices: Vertex[] = [];
  selected_vertices: Vertex[] = [];
  separatorKeysCodes = [ENTER, COMMA];
  addV: Vertex;
  rmV: Vertex;
  inputVals: any;

  dataSource: MatTableDataSource<Vertex>;

  @Output()
  reportSelected: EventEmitter<Vertex[]> = new EventEmitter<Vertex[]>(); // Report the selected vertices to the parent components

  constructor(private vertexProvider: VertexProviderService) {
  }

  ngOnInit() {
    this.getVertices();
    this.dataSource = new MatTableDataSource<Vertex>(this.available_vertices);
    this.inputVals = {};
  }

  getVertices(): void {
    this.vertexProvider.getVertices(this.labels).subscribe(vs => this.available_vertices = vs);
  }

  addLabel(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our label
    if ((value || '').trim()) {
      if (!(this.labels.includes(value.trim()))) {
        this.labels.push(value.trim());
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
    }
  }

  addVertex(): void {
    if (this.addV) {
      this.selected_vertices.push(this.addV)
      this.reportSelected.emit(this.selected_vertices);
      const index = this.available_vertices.indexOf(this.addV);
      if (index >= 0) {
        this.available_vertices.splice(index, 1);
        this.addV = null;
      } else {
        console.log(this.addV.id, 'not found in available vertices');
      }
    }
  }

  removeVertex(): void {
    if (this.rmV) {
      this.available_vertices.push(this.rmV)
      const index = this.selected_vertices.indexOf(this.rmV);
      if (index >= 0) {
        this.selected_vertices.splice(index, 1);
        this.reportSelected.emit(this.selected_vertices)
        this.rmV = null;
      } else {
        console.log(this.rmV.id, 'not found in selected vertices');
      }
    }
  }

  selectAdd(vtx: Vertex): void {
    this.addV = vtx;
    console.log('add vertex id=', this.addV.id);
  }

  selectRemove(vtx: Vertex): void {
    this.rmV = vtx;
    console.log('remove vertex id=', this.rmV.id);
  }

  updateInput($event): void {
    console.log('event=', $event)
    const id = $event.target.id;
    this.inputVals[id] = $event.target.value;
    console.log('name:', id, '|value', $event.target.value);
    console.log(this.inputVals)
  }

}
