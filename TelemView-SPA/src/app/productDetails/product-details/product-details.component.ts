//product page
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/_models/product';
import { ProductsService } from 'src/app/_services/products.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { PaginatedResult } from 'src/app/_models/pagination';
import { Route } from '@angular/compiler/src/core';
import { Location } from '@angular/common';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
  animations: [
    trigger('Fading', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition(':enter', animate('400ms ease-out')),
      transition(':leave', animate('400ms ease-in')),
    ])
  ]
})
export class ProductDetailsComponent implements OnInit {
  product: Product;
  products: Product[] = [];
  imageslUrl = environment.imageslUrl;
  ngxScrollToOffset: 0;
  mediaForGalleryArray = [];
  filesArray = [];

  constructor(
    private productService: ProductsService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router,
    private _location: Location,
    private titleService: Title
  ) {}

  ngOnInit() {
    //get product according to id
    this.route.data.subscribe((data) => {
      this.product = data['product'];
      this.titleService.setTitle('Telem View - ' + this.product.title);
      this.mediaForGallery();
      this.getProducts();
      this.getFiles();
      this.scrollToTop();
    });
  }

    // scroll top
    scrollToTop() {
      window.scrollTo(0, 100);
      (function smoothscroll() {
          var currentScroll = window.pageYOffset;
          if (currentScroll > 0) {
              window.requestAnimationFrame(smoothscroll);
              window.scrollTo(0, currentScroll - (currentScroll / 8));
          }
      })();
  }

  // back to home, preserve filters
  backClicked() {
    let params;
    if (localStorage.getItem('userParams') != null) {
      params = JSON.parse(localStorage.getItem('userParams'));
    } else {
      params = {};
    }
    this.router.navigate(['.'], { queryParams: params });
  }

  //get products for More products part
  //we get products of same filters, same type and same year
  getProducts() {
    this.products = [];
    let params;
    if (localStorage.getItem('userParams') != null) {
      let params = JSON.parse(localStorage.getItem('userParams'));
      if (Object.keys(params).length !== 0 && params.constructor === Object) {
        for (const [key, value] of Object.entries(params)) {
          // make sure param is not empty
          if (params[key].length != 0) {
            this.addProducts(params);
            break;
          }
        }
      }
    }

    let typeParams = {
      productTypes: this.product.productTypeId.toString(),
    };
    this.addProducts(typeParams);
    let years = {
      years: this.product.yearOfCreation.toString(),
    };
    this.addProducts(years);
    let degree = {
      degree: this.product.degree.toString(),
    };
    this.addProducts(degree);
  }

  //load the products
  addProducts(params) {
    this.productService.getProducts(params, 1, 10).subscribe(
      (res: PaginatedResult<Product[]>) => {
        let productsArray = res.result.filter((p) => p.id != this.product.id);
        productsArray.forEach((p) => {
          if (this.products.find((r) => r.id == p.id) == undefined) {
            p.mainPhotoUrl = this.imageslUrl + p.mainPhotoUrl;
            this.products.push(p);
          }
        });
      },
      (error) => {
      }
    );
  }

  // make url safe for angular
  safeURL(videoURL) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(videoURL);
  }

  // prepare media for gallery show
  mediaForGallery() {
    const mediaForGallery = this.product.media.filter(
      (m) => m.type.toLowerCase() != 'file' && m.type.toLowerCase() != 'link'
    );
    this.mediaForGalleryArray = mediaForGallery;
  }

  // get files and links for More info part
  getFiles() {
    const files = this.product.media.filter(
      (m) => m.type.toLowerCase() == 'file' || m.type.toLowerCase() == 'link'
    );
    const newFiles = [];
    files.forEach((file) => {
      let url;
      if (file.type == 'file') {
        url = this.safeURL(this.imageslUrl + file.url);
      } else {
        url = this.safeURL(file.url);
      }
      newFiles.push({
        url: url,
        title: file.mDescription,
        id: file.id,
      });
    });
    this.filesArray = newFiles;
  }
}
