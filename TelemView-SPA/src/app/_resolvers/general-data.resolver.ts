import {Injectable} from '@angular/core';
import {Router, Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {GeneralDataService} from '../_services/generalData.service';
import {Observable, of } from 'rxjs';
import {catchError } from 'rxjs/operators';
import { DataForEdit } from '../_models/DataForEdit';

//resolve general data for product edit page

@Injectable()
export class GeneralDataResolver implements Resolve<DataForEdit[]>{
    constructor(private generalDataService: GeneralDataService, private router: Router){}

    resolve(route: ActivatedRouteSnapshot): Observable<DataForEdit[]>{

        return this.generalDataService.getData().pipe(
            catchError(error => {
                return of(null);
            })
        );
    }
}
