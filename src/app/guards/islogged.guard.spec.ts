import { TestBed, async, inject } from '@angular/core/testing';

import { IsloggedGuard } from './islogged.guard';

describe('IsloggedGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsloggedGuard]
    });
  });

  it('should ...', inject([IsloggedGuard], (guard: IsloggedGuard) => {
    expect(guard).toBeTruthy();
  }));
});
