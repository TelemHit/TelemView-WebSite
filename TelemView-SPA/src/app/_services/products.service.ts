import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Product} from '../_models/product';
import { ActivatedRoute } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class ProductsService {
    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient, private route: ActivatedRoute) {}
    getProducts(productParams?): Observable<Product[]>{
      let params = new HttpParams();
      if (productParams != null){
        if (productParams.params){
          params = productParams.params;
          console.log(params);
        }
      }

      return this.http.get<Product[]>(this.baseUrl + 'product', {params});
    }

    getProduct(id): Observable<Product>{
      return this.http.get<Product>(this.baseUrl + 'product/' + id);
    }
}
