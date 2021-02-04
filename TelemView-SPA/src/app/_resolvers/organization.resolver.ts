import {Injectable} from '@angular/core';
import {Router, Resolve, ActivatedRouteSnapshot, ActivatedRoute} from '@angular/router';
import {GeneralDataService} from '../_services/generalData.service';
import {Observable, of } from 'rxjs';
import {catchError, tap, filter, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';
import { Organization } from '../_models/organization';

//resolve Organizations for Organizations edit page

@Injectable()


export class OrganizationResolver implements Resolve<Organization[]>{

    constructor(private dataService: GeneralDataService, private router: Router,
                private route: ActivatedRoute, private authService: AuthService){}

    resolve(route: ActivatedRouteSnapshot): Observable<Organization[]>{
        return this.dataService.getOrganization(this.authService.decodedToken.nameid).pipe(
            catchError(error => {
                return of(null);
            })
        );
    }
}
