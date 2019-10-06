import { TestBed, inject } from '@angular/core/testing';

import { ClipService } from './clip.service';

describe('ClipService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClipService]
    });
  });

  it('should be created', inject([ClipService], (service: ClipService) => {
    expect(service).toBeTruthy();
  }));
});
