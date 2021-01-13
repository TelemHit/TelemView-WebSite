import {Injectable} from '@angular/core';
import {Product} from '../_models/product';
import {Router, Resolve, ActivatedRouteSnapshot, ActivatedRoute} from '@angular/router';
import {Observable, of } from 'rxjs';
import {catchError, tap, filter, map, switchMap } from 'rxjs/operators';
import { ProductsService } from '../_services/products.service';



@Injectable()
export class ProductListEditorResolver implements Resolve<Product[]>{
    pageNumber = 1;
    pageSize = 20;
    hideUnpublished = false;

    products: Product[];

    constructor(private productService: ProductsService, private router: Router,
                private route: ActivatedRoute){}

    resolve(route: ActivatedRouteSnapshot): Observable<Product[]>{
        return this.productService.getProducts({}, this.pageNumber, this.pageSize, this.hideUnpublished).pipe(
            catchError(error => {
                console.log('problem retrieving data');
                return of(null);
            })
        );
    }
}
