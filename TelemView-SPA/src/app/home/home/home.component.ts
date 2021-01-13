import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/_models/product';
import { ProductsService } from 'src/app/_services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataForHome } from 'src/app/_models/dataForHome';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  dataforhome: DataForHome;
  productParams: any = {};
  imageslUrl = environment.imageslUrl;
  page: number = 1;
  itemsPerPage: number = 4;
  cantGetProduct = false;
  totalPages:number;
  totalCount:number;

  constructor(
    private route: ActivatedRoute,
    private productsServise: ProductsService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      this.productParams = params['params'];
      localStorage.setItem('userParams', JSON.stringify(this.productParams));
      this.page = 1;
      this.products = [];
      this.spinner.show();
      this.loadProducts(1000);
    }, (error) => {
      console.log('problem retriving data');
    });
  }
  checkIfFilters(){
    const params = { ...this.productParams };
    for (const [key, value] of Object.entries(params)){
      if(params[key].length>0) {
        return true
      }
    } 
      return false;
  }
  
  loadProducts(timer) {
    this.productsServise
      .getProducts(this.productParams, this.page, this.itemsPerPage)
      .subscribe(
        (res) => {
          this.dataforhome = res.generalData;
          this.totalPages = res.pagination.totalPages;
          this.totalCount = res.pagination.totalItems;
          // setTimeout(() => {
            res.result.forEach((r) => {
              r.mainPhotoUrl = this.imageslUrl + r.mainPhotoUrl;
              this.products.push(r);
            });
            this.spinner.hide();
          // }, timer);
        },
        (error) => {
          this.spinner.hide();
          this.cantGetProduct=true;
        }
      );
  }

  clearAll() {
    this.productParams = {};
    this.spinner.show();
    this.loadProducts(1000);
  }

  onScroll() {
    this.page += 1;
    if(this.page <= this.totalPages || this.totalPages == undefined){
      this.spinner.show();
    this.loadProducts(1000);
    }
    
  }
}
