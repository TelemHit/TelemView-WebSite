import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpEvent, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Product} from '../_models/product';
import { ActivatedRoute } from '@angular/router';
import { Media } from '../_models/media';

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

    updateProduct(userId: number, id: number, product: Product){
      return this.http.put(this.baseUrl + 'product/' + userId + '/' + id, product);
    }

    uploadMedia(id: number, file: File){
      const formData: FormData = new FormData();
      formData.append('file', file);
      return this.http.post(this.baseUrl + 'editor/product/' + id + '/media', formData, {});
    }

    uploadLink(id: number, media: Media){
      return this.http.post(this.baseUrl + 'editor/product/' + id + '/media/link', media, {});
    }

}
