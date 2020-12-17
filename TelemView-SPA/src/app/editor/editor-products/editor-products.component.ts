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
    private intl: TimeagoIntl
  ) {
    this.modelChanged.pipe(debounceTime(this.debounceTime)).subscribe(() => {
      this.search();
    });
    intl.strings = hebrewStrings;
    intl.changes.next();
  }


  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.products = data.product.result;
      this.pagination = data.product.pagination;
      console.log(data.product);
    });
  }

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

  deleteProduct(id, title) {
    const initialState = {
      title: 'מחיקת תוצר',
      productId: id,
      productTitle: title,
      alert: 'האם ברצונך למחוק את התוצר: ',
    };
    this.bsModalRef = this.modalService.show(AlertModalComponent, {
      initialState,
    });
    this.bsModalRef.content.closeBtnName = 'לא';
    this.bsModalRef.content.approveBtnName = 'כן';

    this.bsModalRef.content.confirm.subscribe((res) => {
      console.log(res.data);
      if (res.data === true) {
        this.finalDeleteProduct(id);
        this.bsModalRef.hide();
      }
    });
  }

  finalDeleteProduct(id) {
    this.productsService
      .deleteProduct(this.authService.decodedToken.nameid, id)
      .subscribe(() => {
        this.products = this.products.filter((p) => p.id !== id);
      });
  }

  pageChanged(e: any): void{
    this.pagination.currentPage = e.page;
    this.loadProducts({});
  }

  loadProducts(search) {
    this.productsService.getProducts(search, this.pagination.currentPage, this.pagination.itemsPerPage)
    .subscribe((res: PaginatedResult<Product[]>) => {
      this.products = res.result;
      this.pagination = res.pagination;
    },
    error => {
      console.log(error);
    });
  }

  clearSearch(){
    this.loadProducts({});
    this.someValue = '';
  }
  modelChange() {
    this.modelChanged.next();
  }
  search(){
    this.loadProducts({params:{search: this.someValue}});
  }
}
