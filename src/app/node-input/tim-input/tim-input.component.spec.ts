import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimInputComponent } from './tim-input.component';

describe('TimInputComponent', () => {
  let component: TimInputComponent;
  let fixture: ComponentFixture<TimInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
