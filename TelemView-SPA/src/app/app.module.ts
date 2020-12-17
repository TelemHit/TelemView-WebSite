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
import { JwtModule } from '@auth0/angular-jwt';
import { TagInputModule } from 'ngx-chips';
import { QuillModule } from 'ngx-quill';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AlertModule } from 'ngx-bootstrap/alert';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TimeagoModule, TimeagoIntl, TimeagoFormatter, TimeagoCustomFormatter } from 'ngx-timeago';


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
import { DataForHomeResolver } from './_resolvers/data-for-home.resolver';
import { ProductDetailsResolver } from './_resolvers/product-details.resolver';
import { AboutFacultyComponent } from './home/about-faculty/about-faculty.component';
import { MultiFilterComponent } from './filters/multi-filter/multi-filter.component';
import { LoginComponent } from './editor/login/login.component';
import { NavComponent } from './editor/nav/nav.component';
import { EditorProductsComponent } from './editor/editor-products/editor-products.component';
import { AuthGuard } from './_guards/auth.guard';
import { PreventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';
import { SideNavComponent } from './editor/side-nav/side-nav.component';
import { ProductListEditorResolver } from './_resolvers/product-list-editor.resolver';
import { ProductEditorResolver } from './_resolvers/product-editor.resolver';
import { EditProductComponent } from './editor/edit-product/edit-product.component';
import { MediaFilterDeletedPipe } from './_pipes/mediaFilterDeleted.pipe';
import { GeneralDataService } from './_services/generalData.service';
import { AuthService } from './_services/auth.service';
import { ModalComponent } from './editor/modal/modal.component';
import { AlertModalComponent } from './editor/alert-modal/alert-modal.component';
import { LinkVideoModalComponent } from './editor/link-video-modal/link-video-modal.component';
import { EditorTypesComponent } from './editor/editor-types/editor-types.component';



export function tokenGetter(){
   return localStorage.getItem('token');
 }

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
      MultiFilterComponent,
      LoginComponent,
      NavComponent,
      EditorProductsComponent,
      SideNavComponent,
      EditProductComponent,
      MediaFilterDeletedPipe,
      ModalComponent,
      AlertModalComponent,
      LinkVideoModalComponent,
      EditorTypesComponent
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
      AlertModule.forRoot(),
      FormsModule,
      NgSelectModule,
      NgxSpinnerModule,
      TimeagoModule.forRoot(
         {formatter: { provide: 
            TimeagoFormatter, useClass: TimeagoCustomFormatter }
         }),
      TagInputModule,
      TooltipModule.forRoot(),
      PaginationModule.forRoot(),
      QuillModule.forRoot({
         modules: {
            toolbar: [
              ['bold'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              ['clean']
            ]
          }
      }),
      BsDatepickerModule.forRoot(),
      ReactiveFormsModule,
      CarouselModule.forRoot(),
      ModalModule.forRoot(),
      JwtModule.forRoot({
         config: {
           tokenGetter,
           allowedDomains: ['localhost:5000'],
           disallowedRoutes: ['localhost:5000/api/auth']
         }
       })
   ],
   providers: [
      ProductsService,
      ProductListResolver,
      DataForHomeResolver,
      ProductDetailsResolver,
      ProductListEditorResolver,
      ProductEditorResolver,
      AuthService,
      AuthGuard,
      PreventUnsavedChangesGuard,
      GeneralDataService,
      TimeagoIntl
   ],
   entryComponents: [
      AlertModalComponent,
      ModalComponent,
      LinkVideoModalComponent
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
