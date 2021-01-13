import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl;

constructor(private http: HttpClient) { }

getUsers(){
  return this.http.get(this.baseUrl + 'admin/users');
}

updateUserRoles(user: User, roles: {}) {
return this.http.post(this.baseUrl + 'admin/edituser/' + user.userName, roles);
}

deleteUser(user: User) {
  return this.http.delete(this.baseUrl + 'admin/' + user.userName);
  }
}
