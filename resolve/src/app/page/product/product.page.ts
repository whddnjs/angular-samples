import { Component, OnInit, inject } from '@angular/core';
import { Product } from '../../interfaces/product.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [],
  templateUrl: './product.page.html',
  styleUrl: './product.page.css'
})
export class ProductPage implements OnInit {

  private readonly route = inject(ActivatedRoute);

  products!: Product[];

  ngOnInit(): void {
    this.route.data.subscribe(res => {
      console.log(res);
      this.products = res['products'];
    })
  }
}
