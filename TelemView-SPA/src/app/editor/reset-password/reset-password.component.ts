//screen for password reset
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ResetPassword } from 'src/app/_models/resetPassword';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { PasswordConfirmationValidatorService } from 'src/app/_services/password-confirmation-validator.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  public resetPasswordForm: FormGroup;
  public showError: boolean;
  public errorMessage: string;
  private _token: string;
  private _email: string;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private _passConfValidator: PasswordConfirmationValidatorService,
    private alertify: AlertifyService,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) {}
  ngOnInit(): void {
    //create form
    this.resetPasswordForm = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{8,}$'
        ),
      ]),
      confirm: new FormControl(''),
    });
    this.resetPasswordForm
      .get('confirm')
      .setValidators([
        Validators.required,
        this._passConfValidator.validateConfirmPassword(
          this.resetPasswordForm.get('password')
        ),
      ]);

    this._token = this.route.snapshot.queryParams['token'];
    this._email = this.route.snapshot.queryParams['email'];
  }
  //validation
  public validateControl = (controlName: string) => {
    return (
      this.resetPasswordForm.controls[controlName].invalid &&
      this.resetPasswordForm.controls[controlName].touched
    );
  };
  //check errors
  public hasError = (controlName: string, errorName: string) => {
    return this.resetPasswordForm.controls[controlName].hasError(errorName);
  };
  //reset
  public resetPassword = (resetPasswordFormValue) => {
    this.spinner.show();
    this.showError = false;
    const resetPass = { ...resetPasswordFormValue };
    const resetPassDto: ResetPassword = {
      password: resetPass.password,
      confirmPassword: resetPass.confirm,
      token: this._token,
      email: this._email,
    };
    this.authService.resetPassword(resetPassDto).subscribe(
      (_) => {
        this.spinner.hide();
        this.alertify.success("הסיסמה הוחלפה בהצלחה");
        this.router.navigate(['editor']);
      },
      (error) => {
        this.spinner.hide();
        this.showError = true;
        this.errorMessage = "הייתה בעיה בהחלפת הסיסמה, יש לוודא כי הסיסמאות תואמות ולנסות שוב";
      }
    );
  };

      //reset alert
      resetAlert(){
        this.errorMessage='';
      }
}
