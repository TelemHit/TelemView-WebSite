import { Routes } from '@angular/router';
import { ProductsComponent } from './home/products/products.component';
import { HomeComponent } from './home/home/home.component';
import { ProductListResolver } from './_resolvers/product-list.resolver';
import { DataForHomeResolver } from './_resolvers/data-for-home.resolver';
import { ProductDetailsComponent } from './productDetails/product-details/product-details.component';
import { ProductDetailsResolver } from './_resolvers/product-details.resolver';
import { LoginComponent } from './editor/login/login.component';
import { AuthGuard } from './_guards/auth.guard';
import { EditorProductsComponent } from './editor/editor-products/editor-products.component';
import { ProductListEditorResolver } from './_resolvers/product-list-editor.resolver';
import { ProductEditorResolver } from './_resolvers/product-editor.resolver';
import { EditProductComponent } from './editor/edit-product/edit-product.component';
import { PreventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';
import { EditorTypesComponent } from './editor/editor-types/editor-types.component';
import { ProductTypesResolver } from './_resolvers/product-types.resolver';
import { EditorTasksComponent } from './editor/editor-tasks/editor-tasks.component';
import { ProductTasksResolver } from './_resolvers/product-tasks.resolver';
import { OrganizationResolver } from './_resolvers/organization.resolver';
import { EditorOrganizationsComponent } from './editor/editor-organizations/editor-organizations.component';
import { EditorOrganizationTypesComponent } from './editor/editor-organization-types/editor-organization-types.component';
import { OrganizationTypeResolver } from './_resolvers/organization-type.resolver';
import { EditorCourseComponent } from './editor/editor-course/editor-course.component';
import { CourseResolver } from './_resolvers/course.resolver';
import { EditorStudentComponent } from './editor/editor-student/editor-student.component';
import { StudentResolver } from './_resolvers/student.resolver';
import { EditorLecturerComponent } from './editor/editor-lecturer/editor-lecturer.component';
import { LecturerResolver } from './_resolvers/lecturer.resolver';
import { EditorTagComponent } from './editor/editor-tag/editor-tag.component';
import { TagResolver } from './_resolvers/tag.resolver';

export const appRoutes: Routes = [
  { path: 'editor', component: LoginComponent },
  {
    path: 'editor',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'products',
        component: EditorProductsComponent,
        resolve: { product: ProductListEditorResolver },
      },
      {
        path: 'products/create',
        component: EditProductComponent,
        resolve: {
          dataforhome: DataForHomeResolver,
        },
        canDeactivate: [PreventUnsavedChangesGuard]
      },
      {
        path: 'products/:id',
        component: EditProductComponent,
        resolve: {
          product: ProductEditorResolver,
          dataforhome: DataForHomeResolver,
        },
        canDeactivate: [PreventUnsavedChangesGuard]
      },
      {
        path: 'types',
        component: EditorTypesComponent,
        resolve: {
          productTypes: ProductTypesResolver,
        }
      },
      {
        path: 'tasks',
        component: EditorTasksComponent,
        resolve: {
          tasks: ProductTasksResolver,
        }
      },
      {
        path: 'organizations',
        component: EditorOrganizationsComponent,
        resolve: {
          organizations: OrganizationResolver,
        }
      },
      {
        path: 'courses',
        component: EditorCourseComponent,
        resolve: {
          courses: CourseResolver,
        }
      },
      {
        path: 'organizationtypes',
        component: EditorOrganizationTypesComponent,
        resolve: {
          organizations: OrganizationTypeResolver,
        }
      },
      {
        path: 'students',
        component: EditorStudentComponent,
        resolve: {
          students: StudentResolver,
        }
      },
      {
        path: 'lecturers',
        component: EditorLecturerComponent,
        resolve: {
          lecturers: LecturerResolver,
        }
      },
      {
        path: 'tags',
        component: EditorTagComponent,
        resolve: {
          tags: TagResolver,
        }
      }
    ],
  },
  {
    path: '',
    component: HomeComponent,
    resolve: {
      products: ProductListResolver,
      dataforhome: DataForHomeResolver,
    },
  },
  {
    path: 'product/:id',
    component: ProductDetailsComponent,
    resolve: { product: ProductDetailsResolver },
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
