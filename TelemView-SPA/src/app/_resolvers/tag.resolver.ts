import {Injectable} from '@angular/core';
import {Router, Resolve, ActivatedRouteSnapshot, ActivatedRoute} from '@angular/router';
import {GeneralDataService} from '../_services/generalData.service';
import {Observable, of } from 'rxjs';
import {catchError, tap, filter, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';
import { Tag } from '../_models/Tag';

//resolve Tags for Edit Tags page

@Injectable()


export class TagResolver implements Resolve<Tag[]>{

    constructor(private dataService: GeneralDataService, private router: Router,
                private route: ActivatedRoute, private authService: AuthService){}

    resolve(route: ActivatedRouteSnapshot): Observable<Tag[]>{
        return this.dataService.getTags(this.authService.decodedToken.nameid).pipe(
            catchError(error => {
                console.log('problem retrieving data');
                return of(null);
            })
        );
    }
}
