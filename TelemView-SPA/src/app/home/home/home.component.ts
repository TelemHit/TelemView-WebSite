import { Component, HostListener, OnInit } from '@angular/core';
import { Product } from 'src/app/_models/product';
import { ProductsService } from 'src/app/_services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataForHome } from 'src/app/_models/dataForHome';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('Fading', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition(':enter', animate('400ms ease-out')),
      transition(':leave', animate('400ms ease-in')),
    ])
  ]
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
  activeFilters=false;
  windowScrolled = false;

    //scrolltop btn on scroll
    @HostListener("window:scroll", ["$event"])
    onWindowScroll() {
    //In chrome and some browser scroll is given to body tag
    let pos = (document.documentElement.scrollTop || document.body.scrollTop);
    // pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
     if(pos >= 600 )   {
     this.windowScrolled=true;
     }
     else{
       this.windowScrolled=false;
     }
    }

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
        localStorage.setItem('userParams', JSON.stringify(this.productParams));
        this.page = 1;
        this.products = [];
        this.spinner.show();
        this.loadProducts(1000);
      },
      (error) => {
      }
    );
    this.titleService.setTitle('Telem View - תוצרי הפקולטה לטכנולוגיות למידה');
  }

  // scroll top
  scrollToTop() {
    (function smoothscroll() {
        var currentScroll = window.pageYOffset;
        if (currentScroll > 0) {
            window.requestAnimationFrame(smoothscroll);
            window.scrollTo(0, currentScroll - (currentScroll / 8));
        }
    })();
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
            if(value.trim() != ''){
              titles.push({
                title: value,
                key: key,
              });
            }
            
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
              if(element.trim() != ''){
                titles.push({
                  title: element,
                  key: key,
                });
              }
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
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
    });
  }

  //checks if any filter is active
  checkIfFilters() {
    const params = { ...this.productParams };
    this.activeFilters = false;
    for (const [key, value] of Object.entries(params)) {
      if (params[key].length > 0) {
        this.activeFilters = true;
        break;
      }
    }
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

          //check filters
          this.checkIfFilters();
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
