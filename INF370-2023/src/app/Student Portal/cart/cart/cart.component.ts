import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/Services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {Md5} from 'ts-md5';
import { environment } from 'src/environments/environment';

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


number : number = 0;
myData: any = [];
crypto = new Md5();
total: number = 0;
quantity: number = 0;
grandtotal: any;
grandtotalquantity: any;
package: any = [];
eWallet: any;
client:any;
StudentID:any;
cli:any;
balance: any;
purchases: any;

constructor(
  private cartService: CartService,
  private snackBar: MatSnackBar,
  private titleservice:Title,
  private router:Router) 
  { this.titleservice.setTitle('Cart');}

ngOnInit(): void {
  this.cartItems = this.cartService.getCartItems();
  this.VAT = JSON.parse(sessionStorage['CurrentVAT'] );
  this.StudentID = sessionStorage.getItem('StudentID');
}

GetHelp(){
  localStorage.removeItem('pageNumber');
  localStorage.setItem('pageNumber', '23');
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
  // Use the toFixed method to round total to 2 decimal places and convert it back to a number
  return parseFloat(total.toFixed(2));
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

getRandomInt(max:any) {
  return Math.floor(Math.random() * max);
}

checkout() {
  // Application URL
  //let url = window.location.;

  this.number = this.getRandomInt(10000);
  let item = this.number.toString();

  this.myData['merchant_id'] = '10030047';
  this.myData['merchant_key'] = 'v15imaq79hxgg';
  this.myData['return_url'] = "http://localhost:4200/student/payment-success";
  this.myData['cancel_url'] = "http://localhost:4200/student/cancel";
  ///this.myData['notify_url'] = environment.WebAPI+'payfastreturn'
  


 // Buyer details
  this.myData['name_first'] = 'Darus'
  this.myData['name_last'] = 'Salaam'
  this.myData['email_address'] = 'u20442409@tuks.co.za'

  // Transaction details
  this.myData['m_payment_id'] = this.StudentID;
  this.myData['amount'] =  this.getTotalAmount();
  this.myData['item_name'] = item;
  this.myData['signature'] = this.generateSignature(this.myData);


  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://sandbox.payfast.co.za/eng/process';
  form.style.display = 'none';

  const merchantid = document.createElement('input');
  merchantid.type = 'hidden';
  merchantid.name = 'merchant_id';
  merchantid.value = this.myData['merchant_id'];
  form.appendChild(merchantid);

  const merchantkey = document.createElement('input');
  merchantkey.type = 'hidden';
  merchantkey.name = 'merchant_key';
  merchantkey.value = this.myData['merchant_key'];
  form.appendChild(merchantkey);

  const returnurl = document.createElement('input');
  returnurl.type = 'hidden';
  returnurl.name = 'return_url';
  returnurl.value = this.myData['return_url'];
  form.appendChild(returnurl);

  const cancelurl = document.createElement('input');
  cancelurl.type = 'hidden';
  cancelurl.name = 'cancel_url';
  cancelurl.value = this.myData['cancel_url'];
  form.appendChild(cancelurl);

 

  const namefirst = document.createElement('input');
  namefirst.type = 'hidden';
  namefirst.name = 'name_first';
  namefirst.value = this.myData['name_first'];
  form.appendChild(namefirst);

  const namelast = document.createElement('input');
  namelast.type = 'hidden';
  namelast.name = 'name_last';
  namelast.value = this.myData['name_last'];
  form.appendChild(namelast);

  const emailaddress = document.createElement('input');
  emailaddress.type = 'hidden';
  emailaddress.name = 'email_address';
  emailaddress.value = this.myData['email_address'];
  form.appendChild(emailaddress);

  const payid = document.createElement('input');
  payid.type = 'hidden';
  payid.name = 'm_payment_id';
  payid.value = this.myData['m_payment_id'];
  form.appendChild(payid);

  const amount = document.createElement('input');
  amount.type = 'hidden';
  amount.name = 'amount';
  amount.value = this.myData['amount'];
  form.appendChild(amount);

  const itemname = document.createElement('input');
  itemname.type = 'hidden';
  itemname.name = 'item_name';
  itemname.value = this.myData['item_name'];
  form.appendChild(itemname);

  
  const signature = document.createElement('input');
  signature.type = 'hidden';
  signature.name = 'signature';
  signature.value = this.myData['signature'];
  form.appendChild(signature);

  document.body.appendChild(form);
  sessionStorage.setItem('payfastTransaction',JSON.stringify(this.myData)) ;
  sessionStorage.setItem('payfastNumber',JSON.stringify(this.number)) ;
  sessionStorage.setItem('grandtotal',JSON.stringify(this.getTotalAmount())) ;
  form.submit();

  document.body.removeChild(form);
}

generateSignature = (data:any, passPhrase = null) => {

  let pfOutput = '';
  for (let key in data) {
    if(data.hasOwnProperty(key)){
      if (data[key] != '') {
        pfOutput +=`${key}=${encodeURIComponent(data[key]).replace(/%20/g, '+')}&`;
      }
    }
  }

  let getString = pfOutput.slice(0, -1);
  if (passPhrase != null) {
    getString +=`&passphrase=${encodeURIComponent(passPhrase).replace(/%20/g, '+')}`;
  }
  return this.crypto.appendAsciiStr(getString).end();
}

}
