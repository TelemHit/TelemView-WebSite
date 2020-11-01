import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/_models/product';
import { ProductsService } from 'src/app/_services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataForHome } from 'src/app/_models/dataForHome';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: Product[];
  dataforhome: DataForHome[];
  productParams: any = {};

  constructor(private route: ActivatedRoute, private productsServise: ProductsService, private router: Router) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.products = data.products;
      this.dataforhome = data.dataforhome;
      console.log(this.dataforhome);
    });

    this.route.queryParamMap
      .subscribe((params) => {
        if (params.keys.length > 0){
          this.productParams = params;
          this.loadProducts();
        }
      }
    );
  }

  loadProducts(){
    this.productsServise.getProducts(this.productParams).subscribe(res =>
      this.products = res
    );
  }

  clearAll(){
    this.productParams = {};
    this.loadProducts();
}
}
