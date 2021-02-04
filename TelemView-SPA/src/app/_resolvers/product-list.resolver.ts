import {Injectable} from '@angular/core';
import {Product} from '../_models/product';
import {Router, Resolve, ActivatedRouteSnapshot, ActivatedRoute} from '@angular/router';
import {ProductsService} from '../_services/products.service';
import {Observable, of } from 'rxjs';
import {catchError, tap, filter, map, switchMap } from 'rxjs/operators';

//resolve products details for home page

@Injectable()
export class ProductListResolver implements Resolve<Product[]>{
    products: Product[];
    pageNumber = 1;
    pageSize = 20;
    
    constructor(private productsService: ProductsService, private router: Router,
                private route: ActivatedRoute){}

    resolve(route: ActivatedRouteSnapshot): Observable<Product[]>{
        return this.productsService.getProducts().pipe(
            catchError(error => {
                return of(null);
            })
        );
    }
}
