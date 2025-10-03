import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly FETCH_CART = "https://dummyjson.com/carts/1";
  private readonly CREATE_CART = "https://dummyjson.com/carts/add";
  private readonly UPDATE_CART = "https://dummyjson.com/carts";

  private cartCountSubject = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {}

  addProduct(userId: number, productId: number) {
    this.checkUserCartAndUpdate(userId, productId);
  }

  checkUserCartAndUpdate(userId: number, productId?: number) {
    this.http.get(this.FETCH_CART).subscribe({
      next: (data: any) => {
        if (!data) {
          if (!!productId) {
            this.createCart(userId, productId);
          }

          return;
        }

        if (!!productId) {
          this.updateCart(data.id, productId)
        } else {
          this.cartCountSubject.next(data?.totalProducts);
        }
      },
      error: (error) => {
        console.error("Error while fetching user cart");
      }
    })
  }

  createCart(userId: number, productId: number) {
    const requestDTO = {
      userId,
      products: [
        {
          id: productId,
          quantity: 1
        }
      ]
    }

    this.http.post(this.CREATE_CART, requestDTO).subscribe({
      next: (data: any) => {
        if (!data) {
          return;
        }

        this.cartCountSubject.next(data?.totalProducts);
      },
      error: (error) => console.error("Error while creating user cart")
    })
  }

  updateCart(cartId: number, productId: number) {
    const url = `${this.UPDATE_CART}/${cartId}`

    const requestDTO = {
      merge: true,
      products: [
        {
          id: productId,
          quantity: 1
        }
      ]
    }

    this.http.put(url, requestDTO).subscribe({
      next: (data: any) => {
        if (!data) {
          return;
        }

        this.cartCountSubject.next(this.cartCountSubject.value + 1);
      },
      error: (error) => console.error("Error while updating user cart")
    })
  }

  getCartCount() {
    return this.cartCountSubject.asObservable();
  }
}
