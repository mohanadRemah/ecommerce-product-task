import {Injectable, OnInit} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {debounceTime, distinctUntilChanged, Observable, Subject, switchMap, tap} from 'rxjs';
import {Category, Product} from '../../models/models';

export const DEFAULT_PAGE = 0;
export const ITEMS_PER_PAGE = 6;

export interface ProductsResponse {
  products: Product[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly PRODUCTS_URL = "https://dummyjson.com/products";
  private readonly SEARCH_PRODUCTS_URL = "https://dummyjson.com/products/search";
  private readonly CATEGORIES_URL = "https://dummyjson.com/products/categories"
  private readonly CATEGORY_PRODUCTS_URL = "https://dummyjson.com/products/category"

  searchSubject = new Subject<string>();
  productsSubject = new Subject<ProductsResponse>();

  resetSearchQuery = new Subject<boolean>();

  constructor(private http: HttpClient) {
    this.searchSubject
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((query) => {
          const url = `${this.SEARCH_PRODUCTS_URL}?q=${query}`;
          return this.http.get<ProductsResponse>(url);
        }),
        tap((data) => this.productsSubject.next(data))
      )
      .subscribe();
  }

  searchProducts(searchQuery: string) {
    this.searchSubject.next(searchQuery);
    return this.resetSearchQuery.asObservable();
  }


  getProducts(limit?: number, skip?: number, searchQuery?: string, category?: string, sort?: string, order?: string) {
    const url = category ? `${this.CATEGORY_PRODUCTS_URL}/${category}` : searchQuery ? `${this.SEARCH_PRODUCTS_URL}?q=${searchQuery}` : this.PRODUCTS_URL;

    let params = new HttpParams()
      .set('limit', limit?.toString() || ITEMS_PER_PAGE.toString())
      .set('skip', skip?.toString() || DEFAULT_PAGE.toString())
      .set('sortBy', !!sort ? sort : '')
      .set('order', !!order ? order : '');

    this.http.get<ProductsResponse>(url, { params }).subscribe(data => {
      this.productsSubject.next(data);
      this.resetSearchQuery.next(true);
    });
  }

  loadProducts() {
    return this.productsSubject.asObservable();
  }

  getCategories() {
    return this.http.get<Category[]>(this.CATEGORIES_URL);
  }

  getCategoryProductsCount(categoryUrl: string) {
    return this.http.get(categoryUrl);
  }
}
