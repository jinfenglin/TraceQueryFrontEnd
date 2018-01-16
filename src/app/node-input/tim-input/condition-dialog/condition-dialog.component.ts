import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FlatLabelAttribDataSource} from '../../select-box/select-box.component';
import {VertexProviderService} from '../../../services/vertex-provider/vertex-provider.service';
import {LabelAttribCondition} from '../../../data-structure/LabelAttribModels';
import {Vertex} from '../../../data-structure/vertex';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-condition-dialog',
  templateUrl: './condition-dialog.component.html',
  styleUrls: ['./condition-dialog.component.css']
})
export class ConditionDialogComponent implements OnInit {
  labelSelectControl = new FormControl('', [Validators.required]);
  labels: string[]; // Candidate labels for selection
  label: string;
  color: string;
  availableColors: string[] = ['#DAF7A6', '#FFC300', '#FF5733', '#C70039', '#900C3F', '#D0D3D4', '#34495E', '#7D3C98'];
  inputVals: Map<string, string>
  dataSource: FlatLabelAttribDataSource; // Data source for the table
  filteredVertices: Vertex[];
  role: string;

  constructor(public dialogRef: MatDialogRef<ConditionDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, // data will be returned as result
              private vertexProvider: VertexProviderService) {
    this.inputVals = new Map<string, string>();
    console.log('Input data for dialog:', data)
    // Read the available labels and color if it exists
    this.labels = data.labels;
    this.color = data.color;
    this.role = data.role;
    if (data.labelAttribs) {
      const lac: LabelAttribCondition = data.labelAttribs;
      this.label = lac.label;
      for (const attrib of lac.attribConditions) {
        this.inputVals.set(attrib.attribName, attrib.condition);
      }
      this.dataSource = new FlatLabelAttribDataSource(this.vertexProvider.getAttribs(this.label));
    }
  }


  onNoClick(): void {
    this.dialogRef.close('close');
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
    this.dataSource = new FlatLabelAttribDataSource(this.vertexProvider.getAttribs(this.label));
    const lac = new LabelAttribCondition(this.label, this.inputVals);
    this.updateLabelAttribConditionBundle(lac);
    console.log('after adding label:', this.data);
  }

  updateInput($event): void {
    const attribName = $event.target.id;
    const value = $event.target.value;
    if (!this.inputVals.has(attribName)) {
      this.inputVals.set(attribName, '');
    }
    this.inputVals.set(attribName, value);
    const lac = new LabelAttribCondition(this.label, this.inputVals);
    this.updateLabelAttribConditionBundle(lac);
  }

  display(attName: string) {
    if (this.inputVals.has(attName)) {
      return this.inputVals.get(attName);
    } else {
      return '';
    }
  }

  /**
   * Update the "labelCondition" filed for the returned result
   * @param lac
   */
  private updateLabelAttribConditionBundle(lac: LabelAttribCondition): void {
    this.data['labelAttribs'] = lac;
  }

  /**
   * Inject the updated color to the result return by the dialog
   */
  updateColor(): void {
    this.data['color'] = this.color;
  }

  updateRole(): void {
    this.data['role'] = this.role;
  }
}
