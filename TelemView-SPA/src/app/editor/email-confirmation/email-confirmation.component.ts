//email confirmation screen
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.css']
})
export class EmailConfirmationComponent implements OnInit {
    public showSuccess: boolean;
    public showError: boolean;
    public errorMessage: string;
    constructor(private _authService: AuthService, private _route: ActivatedRoute) { }
    ngOnInit(): void {
      this.confirmEmail();
    }

    //get email and token from url and confirm in db
    private confirmEmail = () => {
      this.showError = this.showSuccess = false;
      const token = this._route.snapshot.queryParams['token'];
      const email = this._route.snapshot.queryParams['email'];
      console.log(token);
      this._authService.confirmEmail(token, email)
      .subscribe(_ => {
        this.showSuccess = true;
        
      },
      error => {
        this.showError = true;
        this.errorMessage = "הייתה בעיה באישור כתובת המייל, יש לפנות למנהל המערכת.";
      })
    }
  }


