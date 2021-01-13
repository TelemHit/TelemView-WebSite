import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpEvent,
  HttpHeaders,
} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Product } from '../_models/product';
import { ActivatedRoute } from '@angular/router';
import { Media } from '../_models/media';
import { ProductForCreate } from '../_models/ProductForCreate';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';
import { DataForHome } from '../_models/dataForHome';
import { DataForHomeResolver } from '../_resolvers/data-for-home.resolver';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  baseUrl = environment.apiUrl;
  userVariables: any = {};

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  getProducts(
    productParams?,
    page?,
    itemsPerPage?,
    hideUnpublished?
  ): Observable<PaginatedResult<Product[]>> {
    const paginatedResults: PaginatedResult<Product[]> = new PaginatedResult<Product[]>();
    let params = new HttpParams();
    if (productParams != null) {
      for (const [key, value] of Object.entries(productParams)) {
        const newValue: any = value;
        if (typeof newValue == 'string') {
          params = params.append(key, newValue);
        } else {
          for (let id of newValue) {
            params = params.append(key, id);
          }
        }
      }
      console.log(params);
    }
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    if (hideUnpublished == false){
      params = params.append('hideUnpublished', 'false');
    }
    console.log(params);
    return this.http
      .get<Product[]>(this.baseUrl + 'product', { observe: 'response', params })
      .pipe(
        map((response) => {
          paginatedResults.result = response.body['products'];
          paginatedResults.generalData= response.body['generalData'];
          if (response.headers.get('Pagination') != null) {
            paginatedResults.pagination = JSON.parse(
              response.headers.get('Pagination')
            );
          }
          return paginatedResults;
        })
      );
  }

  getProduct(id): Observable<Product> {
    return this.http.get<Product>(this.baseUrl + 'product/' + id);
  }

  updateProduct(userId: number, id: number, product: Product) {
    console.log(product);
    return this.http.put(
      this.baseUrl + 'product/' + userId + '/' + id,
      product
    );
  }

  uploadMedia(id: number, file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post(
      this.baseUrl + 'editor/product/' + id + '/media',
      formData,
      {}
    );
  }

  uploadLink(id: number, media: Media) {
    return this.http.post(
      this.baseUrl + 'editor/product/' + id + '/media/link',
      media,
      {}
    );
  }

  createProduct(userId: number, product: ProductForCreate) {
    return this.http.post(
      this.baseUrl + 'product/editor/' + userId,
      product,
      {}
    );
  }

  publishProduct(userId: number, id: number) {
    return this.http.post(
      this.baseUrl + 'product/editor/publish/' + userId + '/' + id,
      {}
    );
  }

  productOnHomePage(userId: number, id: number) {
    return this.http.post(
      this.baseUrl + 'product/editor/homePage/' + userId + '/' + id,
      {}
    );
  }

  deleteProduct(userId: number, id: number) {
    return this.http.delete(
      this.baseUrl + 'product/editor/' + userId + '/' + id,
      {}
    );
  }
}
