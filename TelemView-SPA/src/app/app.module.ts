import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { NgSelectModule } from '@ng-select/ng-select';

import { AppComponent } from './app.component';
import { ProductsComponent } from './home/products/products.component';
import { ProductCardComponent } from './home/product-card/product-card.component';
import { HomeComponent } from './home/home/home.component';
import { PhotoGalleryComponent } from './home/photo-gallery/photo-gallery.component';
import { NumberOfTypesComponent } from './home/numberOfTypes/numberOfTypes.component';
import { AnimatedNumberComponent } from './home/animatedNumber/animatedNumber.component';
import { HomeAboveFoldComponent } from './home/homeAboveFold/homeAboveFold.component';
import { ProductDetailsComponent } from './productDetails/product-details/product-details.component';
import { TypesTypeComponent } from './home/typesType/typesType.component';
import { KeysPipe } from './filters/filters-nav/filters-nav.component';
import { FiltersNavComponent } from './filters/filters-nav/filters-nav.component';
import { FilterComponent } from './filters/filter/filter.component';
import { ProductsService } from './_services/products.service';
import { appRoutes } from './routes';
import { ProductListResolver } from './_resolvers/product-list.resolver';
import { DataForHomeService } from './_services/dataForHome.service';
import { DataForHomeResolver } from './_resolvers/data-for-home.resolver';
import { ProductDetailsResolver } from './_resolvers/product-details.resolver';
import { AboutFacultyComponent } from './home/about-faculty/about-faculty.component';
import { MultiFilterComponent } from './filters/multi-filter/multi-filter.component';





@NgModule({
   declarations: [
      AppComponent,
      ProductsComponent,
      ProductCardComponent,
      HomeComponent,
      PhotoGalleryComponent,
      NumberOfTypesComponent,
      AnimatedNumberComponent,
      HomeAboveFoldComponent,
      TypesTypeComponent,
      ProductDetailsComponent,
      FiltersNavComponent,
      FilterComponent,
      KeysPipe,
      AboutFacultyComponent,
      MultiFilterComponent
   ],
   imports: [
      BrowserModule,
      HttpClientModule,
      RouterModule.forRoot(appRoutes, {
         anchorScrolling: 'enabled',
         onSameUrlNavigation: 'reload'
       }),
      ScrollToModule.forRoot(),
      NgxGalleryModule,
      BrowserAnimationsModule,
      BsDropdownModule.forRoot(),
      FormsModule,
      NgSelectModule,
      ReactiveFormsModule,
      CarouselModule.forRoot()
   ],
   providers: [
      ProductsService,
      ProductListResolver,
      DataForHomeService,
      DataForHomeResolver,
      ProductDetailsResolver
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
