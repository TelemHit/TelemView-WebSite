import {Routes} from '@angular/router';
import {ProductsComponent} from './home/products/products.component';
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

export const appRoutes: Routes = [

    {path: 'editor', component: LoginComponent},
    {
        path: 'editor',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            {path: 'products', component: EditorProductsComponent, resolve: {product: ProductListEditorResolver}},
            {path: 'products/:id', component: EditProductComponent, resolve: {product: ProductEditorResolver,
                dataforhome: DataForHomeResolver}}
    ]},
    {path: '', component: HomeComponent,
     resolve: {products: ProductListResolver, dataforhome: DataForHomeResolver}},
    {path: 'product/:id', component: ProductDetailsComponent, resolve: {product: ProductDetailsResolver}},
    {path: '**', redirectTo: '', pathMatch: 'full'}
];
