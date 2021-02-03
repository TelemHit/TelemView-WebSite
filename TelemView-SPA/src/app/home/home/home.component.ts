import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/_models/product';
import { ProductsService } from 'src/app/_services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataForHome } from 'src/app/_models/dataForHome';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

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
  itemsPerPage: number = 20;
  cantGetProduct = false;
  totalPages: number;
  totalCount: number;
  chips = [];

  constructor(
    private route: ActivatedRoute,
    private productsServise: ProductsService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private titleService: Title
  ) {}

  ngOnInit() {
    //listen to route and load products on change
    this.route.queryParamMap.subscribe(
      (params) => {
        this.productParams = params['params'];
        console.log(this.chips);
        localStorage.setItem('userParams', JSON.stringify(this.productParams));
        this.page = 1;
        this.products = [];
        this.spinner.show();
        this.loadProducts(1000);
      },
      (error) => {
        console.log('problem retriving data');
      }
    );
    this.titleService.setTitle('Telem View - תוצרי הפקולטה לטכנולוגיות למידה');
  }

  //return list of filters for chips display
  filtersForChips() {
    const params = { ...this.productParams };
    const titles = [];
    this.chips = [];
    for (const [key, value] of Object.entries(params)) {
      if (params[key].length > 0) {
        // if param is string push it, if array - loop and push
        if (typeof value == 'string') {
          if (
            key.toLocaleLowerCase() == 'search' ||
            key.toLocaleLowerCase() == 'degree' ||
            key.toLocaleLowerCase() == 'years'
          ) {
            titles.push({
              title: value,
              key: key,
            });
          } else {
            titles.push({
              title: this.dataforhome[key].find((x) => x.id == value).title,
              id: key,
              key: key,
            });
          }
        } else {
          if (
            key.toLocaleLowerCase() == 'search' ||
            key.toLocaleLowerCase() == 'degree' ||
            key.toLocaleLowerCase() == 'years'
          ) {
            const newValue: any = value;
            newValue.forEach((element) => {
              titles.push({
                title: element,
                key: key,
              });
            });
          } else {
            const newValue: any = value;
            newValue.forEach((element) => {
              titles.push({
                title:
                  this.dataforhome[key].find((x) => x.id == element).title ||
                  this.dataforhome[key].find((x) => x.id == element).name,
                id: element,
                key: key,
              });
            });
          }
        }
      }
    }
    this.chips = titles;
  }

  //clear filter from chips
  clearFilter(item) {
    let params = { ...this.productParams };

    for (const [key, value] of Object.entries(params)) {
      if (key == item.key) {
        if (typeof value == 'string') {
          console.log(params);
          delete params[key];
          break;
        } else {
          let newValue: any = value;
          newValue.forEach((element) => {
            if (
              key.toLocaleLowerCase() == 'search' ||
              key.toLocaleLowerCase() == 'degree' ||
              key.toLocaleLowerCase() == 'years'
            ) {
              if (element == item.title) {
                params[key] = params[key].filter((x) => x != element);
              }
            } else {
              if (element == item.id) {
                params[key] = params[key].filter((x) => x != element);
              }
            }
          });
        }
      }
    }
    console.log(params);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
    });
  }

  //checks if any filter is active
  checkIfFilters() {
    const params = { ...this.productParams };
    for (const [key, value] of Object.entries(params)) {
      if (params[key].length > 0) {
        return true;
      }
    }
    return false;
  }

  //load products from server
  loadProducts(timer) {
    this.productsServise
      .getProducts(this.productParams, this.page, this.itemsPerPage)
      .subscribe(
        (res) => {
          this.dataforhome = res.generalData;
          this.totalPages = res.pagination.totalPages;
          this.totalCount = res.pagination.totalItems;
          res.result.forEach((r) => {
            r.mainPhotoUrl = this.imageslUrl + r.mainPhotoUrl;
            this.products.push(r);
          });
          this.spinner.hide();

          //create chips
          this.filtersForChips();
        },
        (error) => {
          this.spinner.hide();
          this.cantGetProduct = true;
        }
      );
  }

  //load products on scroll
  //we use ngx-Infinite scroll library
  onScroll() {
    this.page += 1;
    //load only if current page lesser then total pages
    if (this.page <= this.totalPages || this.totalPages == undefined) {
      this.spinner.show();
      this.loadProducts(1000);
    }
  }
}
