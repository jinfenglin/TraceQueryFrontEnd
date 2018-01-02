import { TestBed, inject } from '@angular/core/testing';

import { InputDisplayBridgeService } from './input-display-bridge.service';

describe('InputDisplayBridgeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InputDisplayBridgeService]
    });
  });

  it('should be created', inject([InputDisplayBridgeService], (service: InputDisplayBridgeService) => {
    expect(service).toBeTruthy();
  }));
});
