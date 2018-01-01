import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraceGraphComponent } from './trace-graph.component';

describe('TraceGraphComponent', () => {
  let component: TraceGraphComponent;
  let fixture: ComponentFixture<TraceGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraceGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraceGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
