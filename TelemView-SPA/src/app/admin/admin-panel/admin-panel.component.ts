//component of admin panel page
//includes navigation of users list and registration
//includes table of users

import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { ResendEmail } from 'src/app/_models/resendEmail';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/_services/admin.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UserRoleModalComponent } from '../user-role-modal/user-role-modal.component';
import { AlertModalComponent } from 'src/app/editor/alert-modal/alert-modal.component';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ConsoleService } from '@ng-select/ng-select/lib/console.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
})
export class AdminPanelComponent implements OnInit {
  users: User[];
  bsModalRef: BsModalRef;
  html = `<li><strong>Admin</strong> - בעל כל הרשאות העריכה כולל ניהול משתמשים.</li>
  <li><strong>Editor</strong> - בעל כל הרשאות העריכה.</li>
  <li><strong>Student</strong> - הרשאה להעלאת תוצר בלבד.</li>`;
  emailConfirmation = environment.emailConfirmation;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private modalService: BsModalService,
    private titleService: Title,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {
    this.getUsers();
    this.titleService.setTitle('Telem View - ניהול משתמשים');
  }

  //get users for table
  getUsers() {
    this.adminService.getUsers().subscribe(
      (data: User[]) => {
        this.users = data;
      },
      (error) => {
      }
    );
  }

  //open roles modal
  editRolesModal(user: User) {
    const initialState = {
      user: user,
      roles: this.getRolesArray(user),
    };
    this.bsModalRef = this.modalService.show(UserRoleModalComponent, {
      initialState,
    });
    //update roles
    this.bsModalRef.content.updateSelectedRoles.subscribe((data) => {
      const rolesToUpdate = {
        roleNames: [
          ...data.filter((el) => el.checked === true).map((el) => el.name),
        ],
      };
      if (rolesToUpdate) {
        this.adminService.updateUserRoles(user, rolesToUpdate).subscribe(
          () => {
            user.roles = [...rolesToUpdate.roleNames];
          },
          (error) => {
            this.alertify.error('הייתה בעיה בעריכת ההרשאות');
          }
        );
      }
    });
  }

  //get roles of user and mark them as checked for modal
  private getRolesArray(user) {
    const roles = [];
    const userRoles = user.roles;
    const availableRoles: any[] = [
      { name: 'Admin', value: 'Admin' },
      { name: 'Editor', value: 'Editor' },
      { name: 'Student', value: 'Student' },
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

  //check if user is admin
  isAdmin(user) {
    if (user.roles.find((r) => r == 'Admin')) {
      return false;
    }
    return true;
  }

  //resend confirmation
  resendConfirmation(user) {
    let model: ResendEmail = {
      email: user.email,
      clientURI: this.emailConfirmation
    }
    this.adminService
      .resendConfirmation(model)
      .subscribe(
        () => {
          this.alertify.success('מייל אימות נשלח בהצלחה');
        },
        (error) => {
          this.alertify.error('הייתה בעיה בשליחת המייל');
        }
      );
  }
  //delete user
  deleteUser(user: User) {
    const initialState = {
      title: 'מחיקת משתמש',
      eId: user.id,
      eTitle: user.email,
      alert: 'האם ברצונך למחוק את המשתמש: ',
    };
    this.bsModalRef = this.modalService.show(AlertModalComponent, {
      initialState,
    });
    this.bsModalRef.content.closeBtnName = 'לא';
    this.bsModalRef.content.approveBtnName = 'כן';

    this.bsModalRef.content.confirm.subscribe(
      (res) => {
        if (res.data === true) {
          this.adminService.deleteUser(user).subscribe(() => {
            this.alertify.success("המשתמש נמחק בהצלחה");
            this.users = this.users.filter((u) => u.email !== user.email);
          });
        }
        this.bsModalRef.hide();
      },
      (error) => {
        this.alertify.error("הייתה בעיה במחיקת המשתמש");
        this.bsModalRef.hide();
      }
    );
  }

  addUser(newUser: any) {
    this.users.push(newUser);
  }
}
