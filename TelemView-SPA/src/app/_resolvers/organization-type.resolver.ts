import {Injectable} from '@angular/core';
import {Router, Resolve, ActivatedRouteSnapshot, ActivatedRoute} from '@angular/router';
import {GeneralDataService} from '../_services/generalData.service';
import {Observable, of } from 'rxjs';
import {catchError, tap, filter, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';
import { Organization } from '../_models/organization';
import { OrganizationType } from '../_models/organizationType';

//resolve Organization Types for Organization Types edit page

@Injectable()


export class OrganizationTypeResolver implements Resolve<OrganizationType[]>{

    constructor(private dataService: GeneralDataService, private router: Router,
                private route: ActivatedRoute, private authService: AuthService){}

    resolve(route: ActivatedRouteSnapshot): Observable<OrganizationType[]>{
        return this.dataService.getOrganizationTypes(this.authService.decodedToken.nameid).pipe(
            catchError(error => {
                return of(null);
            })
        );
    }
}
