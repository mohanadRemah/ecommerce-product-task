import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Product, SortOption} from '../../../models/models';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {
  @Input() products: Product[] = [];
  @Input() currentPage: number = 1;
  @Input() itemsPerPage: number = 9;
  @Input() totalProducts: number = 0;
  @Input() sortBy: SortOption | undefined;

  @Output() addToCart = new EventEmitter<number>();
  @Output() pageChanged = new EventEmitter<number>();
  @Output() sortChanged = new EventEmitter<{ title: string, order: string }>();

  get totalPages(): number {
    return Math.ceil(this.totalProducts / this.itemsPerPage);
  }

  onSortChange(): void {
    const sortParams = this.getSortParams();
    this.sortChanged.emit(sortParams);
  }

  getSortParams(): { title: string, order: string } {
    if (!this.sortBy) {
      return { title: '', order: '' };
    }

    switch (this.sortBy) {
      case SortOption.RATING:
      case SortOption.POPULARITY:
        return { title: 'rating', order: 'desc' };

      case SortOption.PRICE_LOW:
        return { title: 'price', order: 'asc' };

      case SortOption.PRICE_HIGH:
        return { title: 'price', order: 'desc' };

      default:
        return { title: 'title', order: 'asc' };
    }
  }

  onAddToCartAction(productId: number): void {
    this.addToCart.emit(productId);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChanged.emit(page);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPages = 5;

    let start = Math.max(1, this.currentPage - 2);
    let end = Math.min(this.totalPages, start + maxPages - 1);

    if (end - start < maxPages - 1) {
      start = Math.max(1, end - maxPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }
}
