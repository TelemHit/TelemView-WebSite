//register new user
//only Admin can register new users
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserForRegister } from 'src/app/_models/userForRegister';
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
  @Output() newUser = new EventEmitter<any>();

  constructor(
    private _authService: AuthService,
    private _passConfValidator: PasswordConfirmationValidatorService
  ) {}

  ngOnInit(): void {
    //create register form
    this.registerForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
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
        this.confirmation =
          `רישום המשתמש הצליח ומייל אימות נשלח לכתובת: ` +
          formValues.email +
          `.<br/>יש להגדיר הרשאה מתאימה בטבלת המשתמשים.`;
          const newUser = {
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            email: formValues.email,
            emailConfirmation:false,
            roles:[]
          };
          //update new user in the table
          //we dont set any role during registration
          this.newUser.emit(newUser);
        this.registerForm.reset();
      },
      (error) => {
        this.errorMessage =
          'הייתה בעיה ברישום המשתמש, יש לוודא כי כל הפרטים מולאו בצורה תקינה';
        this.showError = true;
      }
    );
  };
}
