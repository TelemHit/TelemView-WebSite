import {Injectable} from '@angular/core';
import {Router, Resolve, ActivatedRouteSnapshot, ActivatedRoute} from '@angular/router';
import {GeneralDataService} from '../_services/generalData.service';
import {Observable, of } from 'rxjs';
import {catchError, tap, filter, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';
import { Organization } from '../_models/organization';
import { Student } from '../_models/Student';

//resolve Students for Edit Students page

@Injectable()


export class StudentResolver implements Resolve<Student[]>{

    constructor(private dataService: GeneralDataService, private router: Router,
                private route: ActivatedRoute, private authService: AuthService){}

    resolve(route: ActivatedRouteSnapshot): Observable<Student[]>{
        return this.dataService.getStudents(this.authService.decodedToken.nameid).pipe(
            catchError(error => {
                return of(null);
            })
        );
    }
}
