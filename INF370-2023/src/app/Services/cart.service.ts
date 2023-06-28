import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemCountSubject = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCountSubject.asObservable();

  getCartCount(): number {
    const cartData = sessionStorage.getItem('cart');
    if (cartData) {
      const cart: any[] = JSON.parse(cartData);
      return cart.length;
    }
    return 0;
  }

  getCartItems(): any[] {
    const cartData = sessionStorage.getItem('cart');
    if (cartData) {
      return JSON.parse(cartData);
    }
    return [];
  }

  removeFromCart(course: any): void {
    const cartData = sessionStorage.getItem('cart');
    if (cartData) {
      const cartItems: any[] = JSON.parse(cartData);
      const index = cartItems.findIndex(item => item.CourseID === course.CourseID);
      if (index !== -1) {
        cartItems.splice(index, 1);
        sessionStorage.setItem('cart', JSON.stringify(cartItems));
        this.cartItemCountSubject.next(cartItems.length);
      }
    }
  }
}
