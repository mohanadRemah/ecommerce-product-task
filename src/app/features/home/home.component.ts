import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {ITEMS_PER_PAGE, ProductsService} from '../../core/services/products.service';
import {CartService} from '../../core/services/cart.service';
import {AuthService} from '../../core/services/auth.service';
import {Category, Product, SortOption} from '../../models/models';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  categories: any[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 6;

  totalProducts: number = 0;
  totalCategoryProducts: number = 0;

  searchQuery: string = '';
  selectedCategory: Category | undefined;

  sortBy: SortOption = SortOption.POPULARITY;

  currentUserId: number = 0;

  reloadSubject = new Subject<void>();

  constructor(private productsService: ProductsService, private cartService: CartService, private authService: AuthService, private router: Router
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
    this.cartService.checkUserCartAndUpdate(this.currentUserId);

    this.authService.currentUserSubject
      .subscribe(user => {
        if (!user) {
          return;
        }

        this.currentUserId = user.id;
      });

    this.productsService.loadProducts().subscribe({
      next: (data: any) => {
        if (!data) {
          return;
        }

        this.products = data?.products;

        if (!this.selectedCategory) {
          this.totalProducts = data?.total;
        }

        this.totalCategoryProducts = data?.total;
      },
      error: (err) => console.error('Error loading products')
    });

    this.reloadSubject.subscribe(data => {
      this.currentPage = 1;
      this.loadProducts();
    })
  }

  loadCategories(): void {
    this.productsService.getCategories().subscribe( {
      next: (data) => {
        if (!data) {
          return;
        }

        this.categories = data;
        this.loadCategoryProducts();
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
  }

  loadCategoryProducts() {
    this.categories.forEach(category => {
      this.productsService.getCategoryProductsCount(category.url).subscribe({
        next: (data: any) => {
          if (!data) {
            return;
          }
          category.productsCount = data?.total;
        },

        error: (err) => {
          console.error('Error loading categories:', err);
        }
      })
    })
  }

  loadProducts(): void {
    const skip = (this.currentPage - 1) * ITEMS_PER_PAGE;
    this.productsService.getProducts(ITEMS_PER_PAGE, skip, this.searchQuery, this.selectedCategory?.slug);
  }

  onCategorySelected(category: Category): void {
    this.selectedCategory = category;
    this.reloadSubject.next();
  }

  onSortChanged(sortBy: any): void {
    const skip = (this.currentPage - 1) * ITEMS_PER_PAGE;
    this.productsService.getProducts(ITEMS_PER_PAGE, skip, this.searchQuery, this.selectedCategory?.slug, sortBy.title, sortBy.order);
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }

  onAddToCart(productId: number): void {
    this.cartService.addProduct(this.currentUserId, productId);
  }

  ngOnDestroy() {
    this.reloadSubject.unsubscribe();
  }
}
