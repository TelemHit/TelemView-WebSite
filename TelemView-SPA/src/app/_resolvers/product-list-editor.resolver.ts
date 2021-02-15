import {Injectable} from '@angular/core';
import {Product} from '../_models/product';
import {Router, Resolve, ActivatedRouteSnapshot, ActivatedRoute} from '@angular/router';
import {Observable, of } from 'rxjs';
import {catchError, tap, filter, map, switchMap } from 'rxjs/operators';
import { ProductsService } from '../_services/products.service';

//resolve products details for Products edit main page

@Injectable()
export class ProductListEditorResolver implements Resolve<Product[]>{
    pageNumber = 1;
    pageSize = 20;
    isClient = false;

    products: Product[];

    constructor(private productService: ProductsService, private router: Router,
                private route: ActivatedRoute){}

    resolve(route: ActivatedRouteSnapshot): Observable<Product[]>{
        return this.productService.getProducts({}, this.pageNumber, this.pageSize, this.isClient).pipe(
            catchError(error => {
                return of(null);
            })
        );
    }
}
