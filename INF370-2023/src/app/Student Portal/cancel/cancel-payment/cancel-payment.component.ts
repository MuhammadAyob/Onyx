import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-cancel-payment',
  templateUrl: './cancel-payment.component.html',
  styleUrls: ['./cancel-payment.component.scss']
})
export class CancelPaymentComponent implements OnInit {

  constructor(
    public router:Router,
    private titleservice: Title) 
    { this.titleservice.setTitle('Payment cancelled');}

  ngOnInit(): void {
  }

  Back(){
    this.router.navigate(['student/view-cart']);
  }

}
