import {Injectable} from '@angular/core';
import {Product} from '../_models/product';
import {Router, Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {Observable, of } from 'rxjs';
import {catchError } from 'rxjs/operators';
import { ProductsService } from '../_services/products.service';

@Injectable()
export class ProductEditorResolver implements Resolve<Product>{
    products: Product;
    constructor(private productService: ProductsService, private router: Router){}

    resolve(route: ActivatedRouteSnapshot): Observable<Product>{

        return this.productService.getProduct(route.params.id).pipe(
            catchError(error => {
                console.log('problem retrieving product');
                return of(null);
            })
        );
    }
}