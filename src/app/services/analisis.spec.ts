import { TestBed } from '@angular/core/testing';
import { AnalisisService } from './analisis';

describe('AnalisisService', () => {
  let service: AnalisisService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnalisisService]
    });
    service = TestBed.inject(AnalisisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
