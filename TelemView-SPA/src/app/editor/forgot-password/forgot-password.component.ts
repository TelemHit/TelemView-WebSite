//write email to send link for password reset
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ForgotPassword } from 'src/app/_models/forgotPassword';
import { AuthService } from 'src/app/_services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public forgotPasswordForm: FormGroup
  public successMessage: string;
  public errorMessage: string;
  public showSuccess: boolean;
  public showError: boolean;
  resetPassword = environment.resetPassword;

  constructor(private _authService: AuthService) { }
  ngOnInit(): void {
    //create form
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email])
    })
  }
  public validateControl = (controlName: string) => {
    return this.forgotPasswordForm.controls[controlName].invalid && this.forgotPasswordForm.controls[controlName].touched
  }

  //validation function
  public hasError = (controlName: string, errorName: string) => {
    return this.forgotPasswordForm.controls[controlName].hasError(errorName)
  }

  //send email
  public forgotPassword = (forgotPasswordFormValue) => {
    this.showError = this.showSuccess = false;
    const forgotPass = { ...forgotPasswordFormValue };
    const forgotPassDto: ForgotPassword = {
      email: forgotPass.email,
      clientURI: this.resetPassword
    }
    this._authService.forgotPassword(forgotPassDto)
    .subscribe(_ => {
      this.showSuccess = true;
      this.successMessage = 'לינק להחלפת סיסמה נשלח בהצלחה לכתובת המייל שהזנת'
    },
    err => {
      this.showError = true;
      this.errorMessage = 'הייתה בעיה בשליחת המייל, יש לוודא כי כתובת המייל תקינה ונמצאת במערכת';
    })
  }

}
