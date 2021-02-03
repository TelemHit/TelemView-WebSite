import {Injectable} from '@angular/core';
import {Router, Resolve, ActivatedRouteSnapshot, ActivatedRoute} from '@angular/router';
import {GeneralDataService} from '../_services/generalData.service';
import {Observable, of } from 'rxjs';
import {catchError, tap, filter, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';
import { Organization } from '../_models/organization';
import { Course } from '../_models/Course';

//resolve courses for courses edit 

@Injectable()


export class CourseResolver implements Resolve<Course[]>{

    constructor(private dataService: GeneralDataService, private router: Router,
                private route: ActivatedRoute, private authService: AuthService){}

    resolve(route: ActivatedRouteSnapshot): Observable<Course[]>{
        return this.dataService.getCourses(this.authService.decodedToken.nameid).pipe(
            catchError(error => {
                console.log('problem retrieving data');
                return of(null);
            })
        );
    }
}
