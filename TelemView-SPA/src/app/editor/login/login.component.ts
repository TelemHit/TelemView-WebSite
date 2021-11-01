//login
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  model: any = {};
  alert = '';
  rolesAlert: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private titleService:Title
  ) {}

  ngOnInit() {
    //check if user logged in
    if (this.authService.loggedIn) {
      this.router.navigate(['editor/products']);
    }
    this.titleService.setTitle('Telem View - כניסת עורך');
  }

  //login user
  login() {
    this.spinner.show();
    this.authService.login(this.model).subscribe(
      (next) => {
        if (
          this.authService.decodedToken &&
          this.authService.decodedToken.role
        ) {
          const allowedEditRoles = ['Admin', 'Editor'];
          const userRoles = this.authService.decodedToken.role as Array<string>;
          allowedEditRoles.forEach((element) => {
            if (userRoles.includes(element)) {
              this.spinner.hide();
              this.router.navigate(['editor/products']);
            }
          });
          if(userRoles.includes('Student')){
            this.spinner.hide();
            this.router.navigate(['editor/products/create']);
          }
          else{
            setTimeout(t => {
              this.alert="אין לך הרשאות עריכה, יש ליצור קשר עם מנהל המערכת"
              this.spinner.hide();
            }, 5000)
          }
        } else{
          setTimeout(t => {
            this.alert="אין לך הרשאות עריכה, יש ליצור קשר עם מנהל המערכת"
            this.spinner.hide();
          }, 5000)
        }
        
      },
      (error) => {
        this.spinner.hide();
        this.alert=error;
      }
    );
  }

  //reset alert
  resetAlert(){
    this.alert='';
  }
}
