//service of products and media

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

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  baseUrl = environment.apiUrl;
  userVariables: any = {};

  constructor(private http: HttpClient, private route: ActivatedRoute) {}
//get products with pagination
//get parameters for filter, page number, items per page and if need to hide unpublised products for client
  getProducts(
    productParams?,
    page?,
    itemsPerPage?,
    isClient?
  ): Observable<PaginatedResult<Product[]>> {
    const paginatedResults: PaginatedResult<Product[]> = new PaginatedResult<Product[]>();
    let params = new HttpParams();
    //check if client sends filter parameters
    if (productParams != null) {
      //iterate over all the parameters and adds to http params
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
    }
    //add pagination parameters
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    //if user is editor return all products, else only published
    if (isClient == false){
      params = params.append('isClient', 'false');
    }
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

  //get specific product
  getProduct(id): Observable<Product> {
    return this.http.get<Product>(this.baseUrl + 'product/' + id);
  }

  //update product
  updateProduct(userId: number, id: number, product: Product) {
    return this.http.put(
      this.baseUrl + 'product/' + userId + '/' + id,
      product
    );
  }

  //upload media files
  uploadMedia(id: number, file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post(
      this.baseUrl + 'editor/product/' + id + '/media',
      formData,
      {}
    );
  }

  //upload link
  uploadLink(id: number, media: Media) {
    return this.http.post(
      this.baseUrl + 'editor/product/' + id + '/media/link',
      media,
      {}
    );
  }

  //initial creation of product
  createProduct(userId: number, product: ProductForCreate) {
    return this.http.post(
      this.baseUrl + 'product/editor/' + userId,
      product,
      {}
    );
  }

  //publish product
  publishProduct(userId: number, id: number) {
    return this.http.post(
      this.baseUrl + 'product/editor/publish/' + userId + '/' + id,
      {}
    );
  }

  //show product on home page - currently not in use
  productOnHomePage(userId: number, id: number) {
    return this.http.post(
      this.baseUrl + 'product/editor/homePage/' + userId + '/' + id,
      {}
    );
  }

  //delete product
  deleteProduct(userId: number, id: number) {
    return this.http.delete(
      this.baseUrl + 'product/editor/' + userId + '/' + id,
      {}
    );
  }
}
