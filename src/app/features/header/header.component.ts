import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import {CartService} from '../../core/services/cart.service';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import { FormsModule } from '@angular/forms';
import {ProductsService} from '../../core/services/products.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  cartCount: number = 0;
  isLoggedIn: boolean = false;

  searchQuery: string = '';
  searchQuerySubject = new Subject();

  constructor(private authService: AuthService, private productsService: ProductsService, private cartService: CartService, private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.authenticatedSubject().subscribe((data: boolean) => this.isLoggedIn = data);

    this.searchQuerySubject.subscribe(query => {
      if (!this.searchQuery) {
        return;
      }

      this.productsService.searchProducts(this.searchQuery).subscribe(data => this.searchQuery = '');
    });


    this.cartService.getCartCount().subscribe(count => {
      this.cartCount = count;
    });
  }

  onLogin(): void {
    this.router.navigate(['/login']);
  }
}
