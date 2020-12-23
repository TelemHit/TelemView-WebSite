import {Injectable} from '@angular/core';
import {Router, Resolve, ActivatedRouteSnapshot, ActivatedRoute} from '@angular/router';
import {GeneralDataService} from '../_services/generalData.service';
import {Observable, of } from 'rxjs';
import {catchError, tap, filter, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';
import { Task } from '../_models/task';

@Injectable()
export class ProductTasksResolver implements Resolve<Task[]>{
    products: Task[];

    constructor(private dataService: GeneralDataService, private router: Router,
                private route: ActivatedRoute, private authService: AuthService){}

    resolve(route: ActivatedRouteSnapshot): Observable<Task[]>{
        return this.dataService.getTasks(this.authService.decodedToken.nameid).pipe(
            catchError(error => {
                console.log('problem retrieving data');
                return of(null);
            })
        );
    }
}
