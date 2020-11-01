import { Component, OnInit, Input } from '@angular/core';
import { NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { NgxGalleryImage } from '@kolkov/ngx-gallery';
import { NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-gallery',
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.css'],
})
export class PhotoGalleryComponent implements OnInit {
  @Input() products;
  galleryImages = [];
  baseUrl = environment.apiUrl;
  constructor() {}

  ngOnInit() {
    console.log(this.products);
    this.galleryImages = this.loadGallery();
  }

  loadGallery() {
    const imgUrl = [];
    for (const product of this.products) {
      if (product.showOnHomePage) {
        imgUrl.push({
          url: product.mainPhotoUrl,
          title: product.title,
          task: product.taskTitle,
          year: product.yearOfCreation,
          id: product.id
        });
      }
    }
    console.log(imgUrl);
    return imgUrl;
  }
}
