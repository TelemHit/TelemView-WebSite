import { Component, OnInit } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'TelemView-SPA';

  loggedInApp: boolean;
  jwtHelper = new JwtHelperService();

  constructor(private authService: AuthService, private router: Router){}

  //set token and logged-in variables in auth service 
  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.decodedToken = this.jwtHelper.decodeToken(token);
    }
  }

  loggedIn(){
    this.loggedInApp = this.authService.loggedIn();
  }
}
