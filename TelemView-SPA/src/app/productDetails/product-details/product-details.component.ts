import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/_models/product';
import { ProductsService } from 'src/app/_services/products.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { PaginatedResult } from 'src/app/_models/pagination';
import { Route } from '@angular/compiler/src/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product: Product;
  products: Product[] = [];
  imageslUrl = environment.imageslUrl;
  ngxScrollToOffset: 0;
  mediaForGalleryArray = [];

  constructor(
    private productService: ProductsService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router,
    private _location: Location,
    private titleService:Title
    ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.product = data['product'];
      this.titleService.setTitle('Telem View - '+this.product.title);
      this.mediaForGallery();
      this.getProducts();
      let scrollToTop = window.setInterval(() => {
        let pos = window.pageYOffset;
        if (pos > 0) {
          window.scrollTo(0, pos - 20); // how far to scroll on each step
        } else {
          window.clearInterval(scrollToTop);
        }
      }, 8);
    },);
  }

  backClicked() {
    let params;
    if (localStorage.getItem('userParams') != null) {
      params = JSON.parse(localStorage.getItem('userParams'));
    } else {
      params = {};
    }
    this.router.navigate(['.'], {queryParams: params})
  }

  getProducts() {
    this.products=[];
    let params;
    if (localStorage.getItem('userParams') != null) {
      params = JSON.parse(localStorage.getItem('userParams'));
    } else {
      params = {};
    }
    this.addProducts(params);
    console.log(params);
    let typeParams = {
      productTypes: this.product.productTypeId.toString(),
    };
    this.addProducts(typeParams);
    let years = {
      years: this.product.yearOfCreation.toString(),
    };
    this.addProducts(years);
  }

  addProducts(params) {
    
    this.productService.getProducts(params, 0, 10).subscribe(
      (res: PaginatedResult<Product[]>) => {
        let productsArray = res.result.filter((p) => p.id != this.product.id);
        productsArray.forEach((p) => {
          if(this.products.find(r => r.id == p.id)==undefined){
            p.mainPhotoUrl = this.imageslUrl + p.mainPhotoUrl;
            this.products.push(p);
          }
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }
  // make url safe for angular
  safeURL(videoURL) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(videoURL);
  }

  mediaForGallery() {
    const mediaForGallery = this.product.media.filter(
      (m) => m.type.toLowerCase() != 'file'
    );
    console.log(mediaForGallery);
    this.mediaForGalleryArray = mediaForGallery;
  }

  getFiles() {
    const files = this.product.media.filter(
      (m) => m.type.toLowerCase() == 'file'
    );
    const newFiles = [];
    files.forEach((file) => {
      newFiles.push({
        url: this.safeURL(this.imageslUrl + file.url),
        title: file.mDescription,
        id: file.id,
      });
    });
    return newFiles;
  }
}
