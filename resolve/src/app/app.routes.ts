import { Routes } from '@angular/router';
import { HomePage } from './page/home/home.page';
import { ProductPage } from './page/product/product.page';
import { productResolve } from './services/product.resolve';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomePage
  },
  {
    path: 'product',
    component: ProductPage,
    resolve: { products: productResolve }
  }
];
