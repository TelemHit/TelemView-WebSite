import {Injectable} from '@angular/core';
import {DataForHome} from '../_models/dataForHome';
import {Router, Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {DataForHomeService} from '../_services/dataForHome.service';
import {Observable, of } from 'rxjs';
import {catchError } from 'rxjs/operators';

@Injectable()
export class DataForHomeResolver implements Resolve<DataForHome[]>{
    products: DataForHome[];
    constructor(private dataForHomeService: DataForHomeService, private router: Router){}

    resolve(route: ActivatedRouteSnapshot): Observable<DataForHome[]>{

        return this.dataForHomeService.getData().pipe(
            catchError(error => {
                console.log('problem retrieving data');
                return of(null);
            })
        );
    }
}
