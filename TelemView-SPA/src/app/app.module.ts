import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import {
  TimeagoModule,
  TimeagoIntl,
  TimeagoFormatter,
  TimeagoCustomFormatter,
} from 'ngx-timeago';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';


import { AppComponent } from './app.component';
import { ProductCardComponent } from './home/product-card/product-card.component';
import { HomeComponent } from './home/home/home.component';
import { HomeHeaderComponent } from './home/home-header/home-header.component';
import { ProductDetailsComponent } from './productDetails/product-details/product-details.component';
import { TypesTypeComponent } from './home/types-type/types-type.component';
import { ProductsService } from './_services/products.service';
import { PasswordConfirmationValidatorService } from './_services/password-confirmation-validator.service';
import { ErrorHandlerService } from './_services/error-handler.service';

import { appRoutes } from './routes';
import { ProductListResolver } from './_resolvers/product-list.resolver';
import { GeneralDataResolver } from './_resolvers/general-data.resolver';
import { ProductDetailsResolver } from './_resolvers/product-details.resolver';
import { MultiFilterComponent } from './home/multi-filter/multi-filter.component';
import { LoginComponent } from './editor/login/login.component';
import { NavComponent } from './editor/nav/nav.component';
import { EditorProductsComponent } from './editor/editor-products/editor-products.component';
import { AuthGuard } from './_guards/auth.guard';
import { PreventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';
import { SideNavComponent } from './editor/side-nav/side-nav.component';
import { ProductListEditorResolver } from './_resolvers/product-list-editor.resolver';
import { ProductEditorResolver } from './_resolvers/product-editor.resolver';
import { EditProductComponent } from './editor/edit-product/edit-product.component';
import { HasProductsPipe } from './_pipes/hasProductsPipe.pipe';
import { GeneralDataService } from './_services/generalData.service';
import { AuthService } from './_services/auth.service';
import { ModalComponent } from './editor/modal/modal.component';
import { AlertModalComponent } from './editor/alert-modal/alert-modal.component';
import { LinkVideoModalComponent } from './editor/link-video-modal/link-video-modal.component';
import { EditorTypesComponent } from './editor/editor-types/editor-types.component';
import { ProductTypesResolver } from './_resolvers/product-types.resolver';
import { EditorTasksComponent } from './editor/editor-tasks/editor-tasks.component';
import { ProductTasksResolver } from './_resolvers/product-tasks.resolver';
import { OrganizationResolver } from './_resolvers/organization.resolver';
import { EditorOrganizationsComponent } from './editor/editor-organizations/editor-organizations.component';
import { OrganizationTypeResolver } from './_resolvers/organization-type.resolver';
import { EditorOrganizationTypesComponent } from './editor/editor-organization-types/editor-organization-types.component';
import { TagResolver } from './_resolvers/tag.resolver';
import { StudentResolver } from './_resolvers/student.resolver';
import { CourseResolver } from './_resolvers/course.resolver';
import { LecturerResolver } from './_resolvers/lecturer.resolver';

import { EditorCourseComponent } from './editor/editor-course/editor-course.component';
import { EditorTagComponent } from './editor/editor-tag/editor-tag.component';
import { EditorStudentComponent } from './editor/editor-student/editor-student.component';
import { EditorLecturerComponent } from './editor/editor-lecturer/editor-lecturer.component';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { HasRoleDirective } from './_directives/hasRole.directive';
import { AdminService } from './_services/admin.service';
import { UserRoleModalComponent } from './admin/user-role-modal/user-role-modal.component';
import { PhotoGalleryProductComponent } from './productDetails/photo-gallery-product/photo-gallery-product.component';
import { ProductsGalleryComponent } from './productDetails/products-gallery/products-gallery.component';
import { UserNavComponent } from './user-nav/user-nav.component';
import { RegisterUserComponent } from './admin/register-user/register-user.component';
import { ForgotPasswordComponent } from './editor/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './editor/reset-password/reset-password.component';
import { EmailConfirmationComponent } from './editor/email-confirmation/email-confirmation.component';
import { FooterComponent } from './footer/footer.component';
import{ CustomEncoder } from './_services/custom-encoder'

export function tokenGetter() {
  return localStorage.getItem('token');
}


@NgModule({
  declarations: [			
    ResetPasswordComponent,
    ProductCardComponent,
    ForgotPasswordComponent,
    HomeComponent,
    HomeHeaderComponent,
    TypesTypeComponent,
    RegisterUserComponent,
    ProductDetailsComponent,
    UserNavComponent,
    ProductsGalleryComponent,
    MultiFilterComponent,
    LoginComponent,
    NavComponent,
    EditorProductsComponent,
    SideNavComponent,
    EditProductComponent,
    HasProductsPipe,
    ModalComponent,
    AlertModalComponent,
    LinkVideoModalComponent,
    EditorTypesComponent,
    EditorTasksComponent,
    EditorOrganizationsComponent,
    EditorOrganizationTypesComponent,
    EditorCourseComponent,
    EditorTagComponent,
    EditorStudentComponent,
    EditorLecturerComponent,
    AdminPanelComponent,
    EmailConfirmationComponent,
    HasRoleDirective,
    UserRoleModalComponent,
    AppComponent,
    PhotoGalleryProductComponent,
      UserNavComponent,
      FooterComponent
   ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, {
      onSameUrlNavigation: 'reload'
    }),
    ScrollToModule.forRoot(),
    NgxGalleryModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    AlertModule.forRoot(),
    TabsModule.forRoot(),
    FormsModule,
    SwiperModule,
    NgSelectModule,
    NgxSpinnerModule,
    TimeagoModule.forRoot({
      formatter: {
        provide: TimeagoFormatter,
        useClass: TimeagoCustomFormatter,
      },
    }),
    TagInputModule,
    TooltipModule.forRoot(),
    PaginationModule.forRoot(),
    QuillModule.forRoot({
      modules: {
        toolbar: [
          ['bold'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['clean'],
        ],
      },
    }),
    BsDatepickerModule.forRoot(),
    ReactiveFormsModule,
    InfiniteScrollModule,
    CarouselModule.forRoot(),
    ModalModule.forRoot(),
    TypeaheadModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: ['localhost:5000'],
        disallowedRoutes: ['localhost:5000/api/auth'],
      },
    }),
  ],
  providers: [
    ProductsService,
    ProductListResolver,
    ProductTypesResolver,
    GeneralDataResolver,
    ProductDetailsResolver,
    ProductListEditorResolver,
    PasswordConfirmationValidatorService,
    ProductEditorResolver,
    AuthService,
    CustomEncoder,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerService,
      multi: true
    },
    AuthGuard,
    PreventUnsavedChangesGuard,
    GeneralDataService,
    TimeagoIntl,
    ProductTasksResolver,
    OrganizationResolver,
    OrganizationTypeResolver,
    TagResolver,
    StudentResolver,
    CourseResolver,
    LecturerResolver,
    AdminService,
  ],
  entryComponents: [
    AlertModalComponent,
    ModalComponent,
    LinkVideoModalComponent,
    UserRoleModalComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
