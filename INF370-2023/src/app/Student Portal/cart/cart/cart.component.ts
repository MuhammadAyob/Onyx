import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/Services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
 displayedColumns: string[] = 
 [
  'image',
  'course', 
  'amount', 
  'actions'
];

VAT!: any; // Initialize with a default value
cartItems: any[] = [];
constructor(
  private cartService: CartService,
  private snackBar: MatSnackBar,
  private titleservice:Title,
  private router:Router) 
  { this.titleservice.setTitle('Cart');}

ngOnInit(): void {
  this.cartItems = this.cartService.getCartItems();
  this.VAT = JSON.parse( sessionStorage['CurrentVAT'] );
}



removeFromCart(item: any): void {
  this.cartService.removeFromCart(item);
  this.cartItems = this.cartService.getCartItems();
  this.snackBar.open('Course removed from cart', 'Dismiss', {
    duration: 3000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom'
  });
}

onBack(){
  this.router.navigate(['student/view-store']);
}

onCheckout(){
  this.router.navigate(['home/student-home']);
}

getTotalAmount(): number {
  let total = 0.00;
  for (const item of this.cartItems) {
    total += item.Price;
  }
  return total;
}

getVatExclusive(): number {
  const total = this.getTotalAmount();
  const vatMultiplier = (100 + this.VAT.VAT) / 100;
  const vatExclusive = total / vatMultiplier;
  return this.roundToTwoDecimalPlaces(vatExclusive);
}

getVatAmount(): number {
  const total = this.getTotalAmount();
  const vatMultiplier = (100 + this.VAT.VAT) / 100;
  const vatExclusive = total / vatMultiplier;
  const vatAmount = total - vatExclusive;
  return this.roundToTwoDecimalPlaces(vatAmount);
}

private roundToTwoDecimalPlaces(value: number): number {
  return Math.round(value * 100) / 100;
}

}
