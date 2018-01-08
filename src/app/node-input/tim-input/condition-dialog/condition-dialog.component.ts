import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FlatLabelAttribDataSource} from '../../select-box/select-box.component';
import {VertexProviderService} from '../../../services/vertex-provider/vertex-provider.service';
import {LabelAttribCondition} from '../../../data-structure/LabelAttribModels';
import {Vertex} from '../../../data-structure/vertex';

@Component({
  selector: 'app-condition-dialog',
  templateUrl: './condition-dialog.component.html',
  styleUrls: ['./condition-dialog.component.css']
})
export class ConditionDialogComponent implements OnInit {

  labelBuffer: string; // Since label will be returned, use a buffer to avoid unchecked modification since lastest keyboard enter event
  label: string;
  inputVals: Map<string, string>
  dataSource: FlatLabelAttribDataSource;
  filteredVertices: Vertex[];

  constructor(public dialogRef: MatDialogRef<ConditionDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private vertexProvider: VertexProviderService) {
    this.inputVals = new Map<string, string>();
    console.log(data)
    if (data.label) {
      this.label = data.label;
      this.labelBuffer = data.label;
      for (const attrib of data.attribConditions) {
        this.inputVals.set(attrib.attribName, attrib.condition);
      }
      this.dataSource = new FlatLabelAttribDataSource(this.vertexProvider.getAttribs(this.label));
    }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

  previewCondition(): void {
    const lac = new LabelAttribCondition(this.label, this.inputVals);
    this.vertexProvider.getVertices([lac]).subscribe(vs => {
      this.filteredVertices = vs;
    });
  }

  addLabel(): void {
    this.label = this.labelBuffer
    this.dataSource = new FlatLabelAttribDataSource(this.vertexProvider.getAttribs(this.label));
    const lac = new LabelAttribCondition(this.label, this.inputVals);
    this.data = lac;
  }

  updateInput($event): void {
    const attribName = $event.target.id;
    const value = $event.target.value;
    if (!this.inputVals.has(attribName)) {
      this.inputVals.set(attribName, '');
    }
    this.inputVals.set(attribName, value);
    const lac = new LabelAttribCondition(this.label, this.inputVals);
    this.data = lac;
  }

  display(attName: string) {
    if (this.inputVals.has(attName)) {
      return this.inputVals.get(attName);
    } else {
      return '';
    }
  }
}
