import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/_services/admin.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UserRoleModalComponent } from '../user-role-modal/user-role-modal.component';
import { AlertModalComponent } from 'src/app/editor/alert-modal/alert-modal.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
})
export class AdminPanelComponent implements OnInit {
  users: User[];
  bsModalRef: BsModalRef;
  html = `<li><strong>Admin</strong> - בעל כל הרשאות העריכה כולל ניהול משתמשים.</li>
  <li><strong>Editor</strong> - בעל כל הרשאות העריכה.</li>`;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private modalService: BsModalService,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.getUsers();
    this.titleService.setTitle('Telem View - ניהול משתמשים');

  }

  getUsers() {
    this.adminService.getUsers().subscribe(
      (data: User[]) => {
        console.log(data);
        this.users = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  editRolesModal(user: User) {
    const initialState = {
      user: user,
      roles: this.getRolesArray(user),
    };
    this.bsModalRef = this.modalService.show(UserRoleModalComponent, {
      initialState,
    });
    this.bsModalRef.content.updateSelectedRoles.subscribe((data) => {
      const rolesToUpdate = {
        roleNames: [
          ...data.filter((el) => el.checked === true).map((el) => el.name),
        ],
      };
      console.log(rolesToUpdate)
      if(rolesToUpdate){
        this.adminService.updateUserRoles(user, rolesToUpdate).subscribe(() => {
          user.roles = [...rolesToUpdate.roleNames]
        }, (error) => {
          console.log(error);
        });
      }
    });
  }

  private getRolesArray(user) {
    const roles = [];
    const userRoles = user.roles;
    const availableRoles: any[] = [
      { name: 'Admin', value: 'Admin' },
      { name: 'Editor', value: 'Editor' }
    ];

    for (let i = 0; i < availableRoles.length; i++) {
      let isMach = false;

        for (let j = 0; j < userRoles.length; j++) {
          if (availableRoles[i].name === userRoles[j]) {
            isMach = true;
            availableRoles[i].checked = true;
            roles.push(availableRoles[i]);
            break;
          }
        }
          if (!isMach) {
            availableRoles[i].checked = false;
            roles.push(availableRoles[i]);
          }
    }
    return roles;
  }

  isAdmin(user){
    if(user.roles.find(r => r == 'Admin')){
      return false;
    }
    return true;
  }

  deleteUser(user: User) {
    const initialState = {
      title: 'מחיקת משתמש',
      eId: user.id,
      eTitle: user.userName,
      alert: 'האם ברצונך למחוק את המשתמש: ',
    };
    this.bsModalRef = this.modalService.show(AlertModalComponent, {
      initialState,
    });
    this.bsModalRef.content.closeBtnName = 'לא';
    this.bsModalRef.content.approveBtnName = 'כן';

    this.bsModalRef.content.confirm.subscribe((res) => {
      if (res.data === true) {
        this.adminService.deleteUser(user).subscribe(() => {
          console.log(user.userName)
          this.users = this.users.filter(u => u.userName !== user.userName);
        });
        
      }
      this.bsModalRef.hide();
    }, (error) => {
      console.log(error);
      this.bsModalRef.hide();
    });
  }
}
