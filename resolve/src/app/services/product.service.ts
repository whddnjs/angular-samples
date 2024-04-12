import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly http = inject(HttpClient);

  private readonly url = 'https://fakestoreapi.com/products?limit=10';

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.url);
  }
}