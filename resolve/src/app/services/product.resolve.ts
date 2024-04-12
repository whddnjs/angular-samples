import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Product } from "../interfaces/product.interface";
import { ProductService } from "./product.service";

export const productResolve: ResolveFn<Product[]> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

  const productService = inject(ProductService);

  return productService.getProducts();
}