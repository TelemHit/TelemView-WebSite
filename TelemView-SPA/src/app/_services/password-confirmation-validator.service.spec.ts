/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PasswordConfirmationValidatorService } from './password-confirmation-validator.service';

describe('Service: PasswordConfirmationValidator', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PasswordConfirmationValidatorService]
    });
  });

  it('should ...', inject([PasswordConfirmationValidatorService], (service: PasswordConfirmationValidatorService) => {
    expect(service).toBeTruthy();
  }));
});
