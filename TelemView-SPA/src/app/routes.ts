import {Routes} from '@angular/router';
import {ProductsComponent} from './home/products/products.component';
import { HomeComponent } from './home/home/home.component';
import { ProductListResolver } from './_resolvers/product-list.resolver';
import { DataForHomeResolver } from './_resolvers/data-for-home.resolver';
import { ProductDetailsComponent } from './productDetails/product-details/product-details.component';
import { ProductDetailsResolver } from './_resolvers/product-details.resolver';

export const appRoutes: Routes = [
    {path: '', component: HomeComponent,
     resolve: {products: ProductListResolver, dataforhome: DataForHomeResolver}},
    {path: 'product/:id', component: ProductDetailsComponent, resolve: {product: ProductDetailsResolver}},
    {path: '**', redirectTo: '', pathMatch: 'full'}
];
