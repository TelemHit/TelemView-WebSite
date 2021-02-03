//service for all tasks requires Admin role

import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User } from '../_models/user';
import { ResendEmail } from '../_models/resendEmail';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl;

constructor(private http: HttpClient) { }

//gets all users for user management page
getUsers(){
  return this.http.get(this.baseUrl + 'admin/users');
}

//updates roles for user
updateUserRoles(user: User, roles: {}) {
return this.http.post(this.baseUrl + 'admin/edituser/' + user.email, roles);
}

//delete user
deleteUser(user: User) {
  return this.http.delete(this.baseUrl + 'admin/' + user.email);
  }

  //resend confirmation email
  public resendConfirmation = (model: ResendEmail) => {
    return this.http.post(this.baseUrl + 'auth/resendconfirmation/', model);
  }
}
