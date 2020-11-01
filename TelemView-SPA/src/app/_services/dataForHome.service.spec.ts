/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DataForHomeService } from './dataForHome.service';

describe('Service: DataForHome', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataForHomeService]
    });
  });

  it('should ...', inject([DataForHomeService], (service: DataForHomeService) => {
    expect(service).toBeTruthy();
  }));
});
