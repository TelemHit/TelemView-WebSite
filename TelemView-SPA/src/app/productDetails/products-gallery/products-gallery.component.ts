//gallery of More products
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Product } from 'src/app/_models/product';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-products-gallery',
  templateUrl: './products-gallery.component.html',
  styleUrls: ['./products-gallery.component.css']
})
export class ProductsGalleryComponent implements OnChanges {
  @Input() products: Product[];
  localProducts: Product[];

  index = 0;

  // Swiper js configuration
  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 10,
    navigation: {
      nextEl: '.swiper-button-next-unique',
      prevEl: '.swiper-button-prev-unique',
    },
    a11y: {
      enabled: true
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      1280: {
        slidesPerView: 4,
        spaceBetween: 40,
      },
    },
    direction: 'horizontal'
  };
  
  constructor() { }

  //on product change replace products
  ngOnChanges(changes) {
    if(changes.products){
      this.index=0;
      this.localProducts = this.products;
      console.log(this.localProducts)
    }
  }

}
