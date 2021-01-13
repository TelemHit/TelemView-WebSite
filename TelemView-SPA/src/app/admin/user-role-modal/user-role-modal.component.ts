import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { User } from 'src/app/_models/user';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-user-role-modal',
  templateUrl: './user-role-modal.component.html',
  styleUrls: ['./user-role-modal.component.css']
})
export class UserRoleModalComponent implements OnInit {
@Output() updateSelectedRoles = new EventEmitter();
  user: User;
  roles: any[];

 
  constructor(public bsModalRef: BsModalRef, private authService: AuthService) {}
 
  ngOnInit() {

  }

  updateRoles(){
    this.updateSelectedRoles.emit(this.roles);
    this.bsModalRef.hide();
  }

  isAdmin(user){
    if(this.authService.RoleMatch(['Admin']) && user.id == this.authService.decodedToken.nameid){
      return true;
    }
    return false;
  }
}
