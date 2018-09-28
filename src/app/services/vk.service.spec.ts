import { TestBed } from '@angular/core/testing';

import { VKService } from './vk.service';

describe('VKService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VKService = TestBed.get(VKService);
    expect(service).toBeTruthy();
  });
});
