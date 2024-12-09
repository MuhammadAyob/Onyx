import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/Services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {Md5} from 'ts-md5';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrls: ['./view-invoice.component.scss']
})
export class ViewInvoiceComponent implements OnInit {
displayedColumns: string[] = 
  [
   'CourseID',
   'Name', 
   'Price'
 ];

invoice:any;

  constructor( 
    private titleservice:Title,
    private router:Router) 
    {this.titleservice.setTitle('Invoices'); }

  ngOnInit(): void {
    this.invoice = JSON.parse( sessionStorage['invoice'] );
  }

  onBack(){
    this.router.navigate(['student/read-invoices']);
  }


  
  getVatExclusive(): number {
    const total = this.invoice.Total
    const vatMultiplier = (100 + this.invoice.VatAmount) / 100;
    const vatExclusive = total / vatMultiplier;
    return this.roundToTwoDecimalPlaces(vatExclusive);
  }
  
  getVatAmount(): number {
    const total = this.invoice.Total
    const vatMultiplier = (100 + this.invoice.VatAmount) / 100;
    const vatExclusive = total / vatMultiplier;
    const vatAmount = total - vatExclusive;
    return this.roundToTwoDecimalPlaces(vatAmount);
  }
  
  private roundToTwoDecimalPlaces(value: number): number {
    return Math.round(value * 100) / 100;
  }

}
