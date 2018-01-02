import { TestBed, inject } from '@angular/core/testing';

import { TraceQueryService } from './trace-query.service';

describe('TraceQueryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TraceQueryService]
    });
  });

  it('should be created', inject([TraceQueryService], (service: TraceQueryService) => {
    expect(service).toBeTruthy();
  }));
});
