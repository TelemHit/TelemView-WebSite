/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GeneralDataService } from './generalData.service';

describe('Service: GeneralData', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeneralDataService]
    });
  });

  it('should ...', inject([GeneralDataService], (service: GeneralDataService) => {
    expect(service).toBeTruthy();
  }));
});
