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
    if (this.authService.loggedIn) {
      this.router.navigate(['editor/products']);
    }
    this.titleService.setTitle('Telem View - כניסת עורך');
  }

  login() {
    this.spinner.show();
    this.authService.login(this.model).subscribe(
      (next) => {
        if (
          this.authService.decodedToken &&
          this.authService.decodedToken.role
        ) {
          const allowedRoles = ['Admin', 'Editor'];
          const userRoles = this.authService.decodedToken.role as Array<string>;
          allowedRoles.forEach((element) => {
            if (userRoles.includes(element)) {
              this.router.navigate(['editor/products']);
            }
          });
        }
        setTimeout(t => {
          this.rolesAlert = true;
          this.spinner.hide();
        }, 1000)
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
        if (error.error == 'user does not exist') {
          this.alert = 'כתובת המייל שהזנת לא קיימת במערכת';
        } else if (error.status == 401) {
          this.alert = 'הסיסמה שהזנת שגויה';
        } else {
          this.alert = 'הייתה בעיה בהתחברות, יש לנסות שנית';
        }
      }
    );
  }
}
