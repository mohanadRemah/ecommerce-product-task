export interface User {
  id: number;
  accessToken: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
}

export interface Category {
  name: string;
  url: string;
  slug: string;
  productsCount: string;
}

export enum SortOption {
  POPULARITY = 'popularity',
  PRICE_LOW = 'price-low',
  PRICE_HIGH = 'price-high',
  RATING = 'rating'
}
