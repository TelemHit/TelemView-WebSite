//register new user
//only Admin can register new users
import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserForRegister } from 'src/app/_models/userForRegister';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { PasswordConfirmationValidatorService } from 'src/app/_services/password-confirmation-validator.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css'],
})
export class RegisterUserComponent implements OnInit {
  public registerForm: FormGroup;
  public errorMessage: string = '';
  public showError: boolean;
  emailConfirmation = environment.emailConfirmation;
  confirmation = '';
  modalRef: BsModalRef;
  @Output() newUser = new EventEmitter<any>();
  @ViewChild('confirmRegister', { static: true }) confirmRegister: ElementRef;

  constructor(
    private _authService: AuthService,
    private _passConfValidator: PasswordConfirmationValidatorService,
    private spinner: NgxSpinnerService,
    private alertify: AlertifyService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    //create register form
    this.registerForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{8,}$'
        ),
      ]),
      confirm: new FormControl(''),
    });
    //validators for Confirm password input
    this.registerForm
      .get('confirm')
      .setValidators([
        Validators.required,
        this._passConfValidator.validateConfirmPassword(
          this.registerForm.get('password')
        ),
      ]);
  }

  //validate controls - check if touched and invalid
  public validateControl = (controlName: string) => {
    return (
      this.registerForm.controls[controlName].invalid &&
      this.registerForm.controls[controlName].touched
    );
  };

  //check if form has errors
  public hasError = (controlName: string, errorName: string) => {
    return this.registerForm.controls[controlName].hasError(errorName);
  };

  //register user
  public registerUser = (registerFormValue) => {
    this.spinner.show('spinnerbtn');
    this.showError = false;
    const formValues = { ...registerFormValue };
    const user: UserForRegister = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      password: formValues.password,
      confirmPassword: formValues.confirm,
      clientURI: this.emailConfirmation,
    };

    this._authService.registerUser(user).subscribe(
      (_) => {
        this.spinner.hide('spinnerbtn');
        this.confirmation = formValues.email;
        this.modalRef = this.modalService.show(this.confirmRegister);
        const newUser = {
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          email: formValues.email,
          emailConfirmation: false,
          roles: [],
        };
        //update new user in the table
        //we dont set any role during registration
        this.newUser.emit(newUser);
        this.registerForm.reset();
      },
      (error) => {
        this.spinner.hide('spinnerbtn');
        this.errorMessage =
          'הייתה בעיה ברישום המשתמש, יש לוודא כי כל הפרטים מולאו בצורה תקינה';
        this.showError = true;
      }
    );
  };

  //reset alert
  resetAlert() {
    this.errorMessage = '';
  }
}
