import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { TmplAstRecursiveVisitor } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router){}
  canActivate(next: ActivatedRouteSnapshot): boolean {
    const roles = next.firstChild.data['roles'] as Array<string>;
    if (roles){
      const match = this.authService.RoleMatch(roles);
      if(match){
        return true;
      }
      else{
        this.router.navigate(['editor']);
      }
    }
    if (this.authService.loggedIn()){
      return true;
    }

    this.router.navigate(['editor']);
    return false;
  }
}
