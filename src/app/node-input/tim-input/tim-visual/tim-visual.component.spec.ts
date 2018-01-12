import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimVisualComponent } from './tim-visual.component';

describe('TimVisualComponent', () => {
  let component: TimVisualComponent;
  let fixture: ComponentFixture<TimVisualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimVisualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
