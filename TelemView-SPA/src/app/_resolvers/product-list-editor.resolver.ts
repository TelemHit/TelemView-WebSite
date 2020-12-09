import {Injectable} from '@angular/core';
import {Product} from '../_models/product';
import {Router, Resolve, ActivatedRouteSnapshot, ActivatedRoute} from '@angular/router';
import {Observable, of } from 'rxjs';
import {catchError, tap, filter, map, switchMap } from 'rxjs/operators';
import { ProductsService } from '../_services/products.service';

@Injectable()
export class ProductListEditorResolver implements Resolve<Product[]>{
    products: Product[];

    constructor(private productService: ProductsService, private router: Router,
                private route: ActivatedRoute){}

    resolve(route: ActivatedRouteSnapshot): Observable<Product[]>{
        return this.productService.getProducts().pipe(
            catchError(error => {
                console.log('problem retrieving data');
                return of(null);
            })
        );
    }
}
