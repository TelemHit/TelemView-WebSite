import {Injectable} from '@angular/core';
import {ProductType} from '../_models/productType';
import {Router, Resolve, ActivatedRouteSnapshot, ActivatedRoute} from '@angular/router';
import {GeneralDataService} from '../_services/generalData.service';
import {Observable, of } from 'rxjs';
import {catchError, tap, filter, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';

//resolve Types for Edit Types page

@Injectable()
export class ProductTypesResolver implements Resolve<ProductType[]>{
    products: ProductType[];

    constructor(private dataService: GeneralDataService, private router: Router,
                private route: ActivatedRoute, private authService: AuthService){}

    resolve(route: ActivatedRouteSnapshot): Observable<ProductType[]>{
        return this.dataService.getProductTypes(this.authService.decodedToken.nameid).pipe(
            catchError(error => {
                return of(null);
            })
        );
    }
}
