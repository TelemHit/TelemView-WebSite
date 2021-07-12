//side nav for editor
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/_services/admin.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
})
export class SideNavComponent implements OnInit {
  name: string;
  constructor(
    private authservice: AuthService,
    private router: Router,
    private adminService: AdminService,
    private spinner: NgxSpinnerService,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {
    this.name = this.authservice.decodedToken?.unique_name;
  }
  //log out
  logOut() {
    localStorage.removeItem('token');
    this.authservice.decodedToken = null;
    this.router.navigate(['/editor']);
  }
  //check if log in
  loggedIn() {
    return this.authservice.loggedIn();
  }

  //updateSitemap
  updateSitemap() {
    this.spinner.show();
    this.adminService.updateSitemap().subscribe(() => {
      this.spinner.hide();
      this.alertify.success('בוצע עדכון ל-Sitemap');
    }, (error) => {
      this.alertify.error("נכשל עדכון ל-Sitemap");
      this.spinner.hide();
    });
  }
}
