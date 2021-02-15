import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/_models/product';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from 'src/app/_services/products.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertModalComponent } from '../alert-modal/alert-modal.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TimeagoIntl } from 'ngx-timeago';
import {strings as hebrewStrings} from 'ngx-timeago/language-strings/he';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-editor-products',
  templateUrl: './editor-products.component.html',
  styleUrls: ['./editor-products.component.css'],
})
export class EditorProductsComponent implements OnInit {
  bsModalRef: BsModalRef;
  pagination: Pagination;
  products: Product[];
  isFocused = false;
  someValue = '';
  modelChanged: Subject<string> = new Subject<string>();
  debounceTime = 500;
  live;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private authService: AuthService,
    private modalService: BsModalService,
    private intl: TimeagoIntl,
    private alertify:AlertifyService,
    private titleService:Title
  ) {
    //wait 0.5 second before search
    this.modelChanged.pipe(debounceTime(this.debounceTime)).subscribe(() => {
      this.search();
    });
    //show time ago in hebrew
    intl.strings = hebrewStrings;
    intl.changes.next();
  }


  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.products = data.product.result;
      this.pagination = data.product.pagination;
      this.titleService.setTitle('Telem View - עריכת תוצרים');
    });
    this.scrollToTop();
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

  //publish
  publishProduct(id) {
    this.productsService
      .publishProduct(this.authService.decodedToken.nameid, id)
      .subscribe(() => {
        const product = this.products.find((i) => i.id === id).isPublish;
        product
          ? (this.products.find((i) => i.id === id).isPublish = false)
          : (this.products.find((i) => i.id === id).isPublish = true);
      });
  }

  //show on home page - not in use
  setOnHomePage(id) {
    this.productsService
      .productOnHomePage(this.authService.decodedToken.nameid, id)
      .subscribe(() => {
        const product = this.products.find((i) => i.id === id).showOnHomePage;
        product
          ? (this.products.find((i) => i.id === id).showOnHomePage = false)
          : (this.products.find((i) => i.id === id).showOnHomePage = true);
      });
  }

  //open delete modal
  deleteProduct(id, title) {
    const initialState = {
      title: 'מחיקת תוצר',
      eId: id,
      eTitle: title,
      alert: 'האם ברצונך למחוק את התוצר: ',
    };
    this.bsModalRef = this.modalService.show(AlertModalComponent, {
      initialState,
    });
    this.bsModalRef.content.closeBtnName = 'לא';
    this.bsModalRef.content.approveBtnName = 'כן';

    this.bsModalRef.content.confirm.subscribe((res) => {
      if (res.data === true) {
        this.finalDeleteProduct(id);
        
      }
    });
  }

  //delete
  finalDeleteProduct(id) {
    this.productsService
      .deleteProduct(this.authService.decodedToken.nameid, id)
      .subscribe(() => {
        this.products = this.products.filter((p) => p.id !== id);
        this.bsModalRef.hide();
        this.alertify.success('התוצר נמחק בהצלחה');
      },
      (error) => {
        this.bsModalRef.hide();
        this.alertify.error('הייתה בעיה במחיקת התוצר');
      }
      );
  }

  //pagination
  pageChanged(e: any): void{
    this.pagination.currentPage = e.page;
    this.loadProducts({});
  }

  //load more products
  loadProducts(search) {
    this.productsService.getProducts(search, this.pagination.currentPage, this.pagination.itemsPerPage, false)
    .subscribe((res: PaginatedResult<Product[]>) => {
      this.products = res.result;
      this.pagination = res.pagination;
    },
    error => {
    });
  }

  //clear search
  clearSearch(){
    this.loadProducts({});
    this.someValue = '';
  }
  //search input change
  modelChange() {
    this.modelChanged.next();
  }
  //search
  search(){
    this.loadProducts({search: this.someValue});
  }
}
