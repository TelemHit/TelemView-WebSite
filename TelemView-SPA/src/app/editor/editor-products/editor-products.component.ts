import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/_models/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editor-products',
  templateUrl: './editor-products.component.html',
  styleUrls: ['./editor-products.component.css']
})
export class EditorProductsComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }
  products: Product[];

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.products = data.product;
      console.log(this.products);
    });
  }

}
