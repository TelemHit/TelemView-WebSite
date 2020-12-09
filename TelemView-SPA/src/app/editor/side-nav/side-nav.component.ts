import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {
  name: string;
  constructor(private authservice: AuthService, private router: Router) { }

  ngOnInit() {
    this.name = this.authservice.decodedToken?.unique_name;
  }

  logOut(){
    localStorage.removeItem('token');
    this.router.navigate(['/editor']);
  }
  loggedIn(){
    return this.authservice.loggedIn();
  }
}
