//service for authorization proccesses

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserForRegister } from 'src/app/_models/userForRegister'
import { RegistrationResponse } from 'src/app/_models/registrationResponse'
import { ForgotPassword } from 'src/app/_models/forgotPassword'
import { ResetPassword } from 'src/app/_models/resetPassword'
import { CustomEncoder } from './custom-encoder';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;

  constructor(private http: HttpClient) {}

  //register
  registerUser(model: UserForRegister) {
    return this.http.post<RegistrationResponse> (this.baseUrl + 'register', model);
  }

  //login
  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          localStorage.setItem('token', user.token);
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
        }
      })
    );
  }

  //check if token expired
  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  //check if item in a list of roles match to one of user roles 
  RoleMatch(allowedRoles): boolean {
    let isMatch = false;
    if (this.decodedToken && this.decodedToken.role) {
      const userRoles = this.decodedToken.role as Array<string>;
      allowedRoles.forEach((element) => {
        if (userRoles.includes(element)) {
          isMatch = true;
          return;
        }
      });
    }
    return isMatch;
  }

  //forgot password
  public forgotPassword(model: ForgotPassword) {
    return this.http.post(this.baseUrl + 'forgotpassword', model);
  }

  //reset password
  public resetPassword = (model: ResetPassword) => {
    return this.http.post(this.baseUrl + 'resetpassword', model);
  }

  //confirmation of email by the user
  public confirmEmail = (token: string, email: string) => {
    let params = new HttpParams({ encoder: new CustomEncoder() })
    params = params.append('token', token);
    params = params.append('email', email);
    return this.http.get(this.baseUrl + 'emailconfirmation', { params: params });
  }

}
