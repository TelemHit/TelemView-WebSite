import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/_models/product';
import { ProductsService } from 'src/app/_services/products.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: Product;

  constructor(private productService: ProductsService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    //this.loadProduct();
    this.route.data.subscribe(data => {
      this.product = data["product"];
      console.log(this.product);
    });
  }
}
  //loadProduct() {
  //  this.productService.getProduct(+this.route.snapshot.params['id'])
  //  .subscribe((product: Product) => {
  //    this.product = product;
  //  }, error => {
  //    console.log('problem to get user');
  //  });
  //}

