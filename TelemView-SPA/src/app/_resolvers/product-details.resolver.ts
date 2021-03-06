import {Injectable} from '@angular/core';
import {Product} from '../_models/product';
import {Router, Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {ProductsService} from '../_services/products.service';
import {Observable, of } from 'rxjs';
import {catchError } from 'rxjs/operators';

//resolve product details for product page

@Injectable()
export class ProductDetailsResolver implements Resolve<Product>{
    products: Product;
    constructor(private productsService: ProductsService, private router: Router){}

    resolve(route: ActivatedRouteSnapshot): Observable<Product>{

        return this.productsService.getProduct(route.params['id']).pipe(
            catchError(error => {
                this.router.navigate(['.']);
                return of(null);
            })
        );
    }
}
