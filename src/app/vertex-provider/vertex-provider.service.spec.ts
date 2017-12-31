import { TestBed, inject } from '@angular/core/testing';

import { VertexProviderService } from './vertex-provider.service';

describe('VertexProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VertexProviderService]
    });
  });

  it('should be created', inject([VertexProviderService], (service: VertexProviderService) => {
    expect(service).toBeTruthy();
  }));
});
