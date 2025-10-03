import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Product} from '../../../models/models';

@Component({
  selector: 'app-product-card',
  standalone: false,
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() addToCartClicked = new EventEmitter<number>();

  getDiscountedPrice(): number {
    return this.product?.price - (this.product?.price * this.product?.discountPercentage / 100);
  }

  addToCart(): void {
    this.addToCartClicked.emit(this.product.id);
  }
}
