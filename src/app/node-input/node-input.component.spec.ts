import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeInputComponent } from './node-input.component';

describe('NodeInputComponent', () => {
  let component: NodeInputComponent;
  let fixture: ComponentFixture<NodeInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
