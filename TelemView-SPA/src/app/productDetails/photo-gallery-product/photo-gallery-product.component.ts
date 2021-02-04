//gallery of product media
import { Component, OnInit, Input, AfterViewInit, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

import { SwiperOptions } from 'swiper';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-photo-gallery-product',
  templateUrl: './photo-gallery-product.component.html',
  styleUrls: ['./photo-gallery-product.component.css'],
})
export class PhotoGalleryProductComponent implements OnChanges {
  @Input() media;
  galleryImages = [];
  baseUrl = environment.apiUrl;
  imageslUrl = environment.imageslUrl;
  myInterval = 0;
  activeSlideIndex = 0;
  bigImage='';
  bigImageTitle='';

  index = 0;
  //we use Swiper library
  config: SwiperOptions = {
    slidesPerView: 1,
    pagination: { el: '.swiper-pagination-unique-top', clickable: true },
    navigation: {
      nextEl: '.swiper-button-next-unique-top',
      prevEl: '.swiper-button-prev-unique-top',
    },
    a11y: {
      enabled: true
    },
    direction: 'horizontal',
    spaceBetween: 30
  };
  @ViewChild('bigImagePop') bigImagePop: ElementRef;
  @ViewChild('pagination') pagination: ElementRef;

  constructor(private sanitizer: DomSanitizer, private route: ActivatedRoute) {}

  //load gallery on product change
  ngOnChanges(changes) {
    if(changes.media){
      this.index=0;
      this.galleryImages = this.loadGallery();
    }
  }

  //set focus on image enlarge
  setSmallFocus(){
    setTimeout(() => this.bigImagePop.nativeElement.focus());
  }
   //return focus to pagination
   returnFocus(){
    setTimeout(() => this.pagination.nativeElement.focus());
  }
  // make url safe for angular
  safeURL(videoURL) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(videoURL);
  }

  //prepare media for show
  loadGallery() {
    const imgUrl = [];
    const newMaedia = this.media.slice();
    for (const [i, img] of newMaedia.entries()) {
      let url;
      //if video exists - push it first
      if (img.type == 'video') {
        url = this.safeURL(img.url);
        imgUrl.push({
          url: url,
          title: img.mDescription,
          id: img.id,
          type: img.type,
        });
        newMaedia.splice(i, 1);
      }
    }
    for (const [i, img] of newMaedia.entries()) {
      let url;
      if (img.isMain == true) {
        url = this.imageslUrl + img.url;
        imgUrl.push({
          url: url,
          title: img.mDescription,
          id: img.id,
          type: img.type,
        });
        newMaedia.splice(i, 1);
      }
    }
    for (const img of newMaedia) {
      let url;
      if (img.type == 'image') {
        url = this.imageslUrl + img.url;
      } else {
        url = this.safeURL(img.url);
      }
      imgUrl.push({
        url: url,
        title: img.mDescription,
        id: img.id,
        type: img.type,
      });
    }
    return imgUrl;
  }
}
