import {Injectable} from '@angular/core';
import {Router, Resolve, ActivatedRouteSnapshot, ActivatedRoute} from '@angular/router';
import {GeneralDataService} from '../_services/generalData.service';
import {Observable, of } from 'rxjs';
import {catchError, tap, filter, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';
import { Organization } from '../_models/organization';
import { Lecturer } from '../_models/lecturer';

@Injectable()


export class LecturerResolver implements Resolve<Lecturer[]>{

    constructor(private dataService: GeneralDataService, private router: Router,
                private route: ActivatedRoute, private authService: AuthService){}

    resolve(route: ActivatedRouteSnapshot): Observable<Lecturer[]>{
        return this.dataService.getLecturers(this.authService.decodedToken.nameid).pipe(
            catchError(error => {
                console.log('problem retrieving data');
                return of(null);
            })
        );
    }
}
