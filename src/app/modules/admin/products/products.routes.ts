import { Routes } from '@angular/router';
import { ProductsComponent } from './products.component';
import { ProductCreateComponent } from './product-create/product-create.component';
import { ProductsListComponent } from './products-list/products-list.component';

export default [
  {
    path: '',
    component: ProductsComponent
  }
] as Routes;
