import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { PaymentService } from 'src/app/Services/payment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { CartDetails } from 'src/app/Models/CartDetails.model';
@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss'],
  providers: [DatePipe]
})
export class PaymentSuccessComponent implements OnInit {

myDate = new Date();
cartObject : any;
payfastNumber:any
grandTotal : any;
StudentID:any;

constructor( 
    public router:Router,
    private titleservice: Title,
    private service:PaymentService,
    private snack:MatSnackBar,
    private dialog: MatDialog,) 
    { this.titleservice.setTitle('Payment succesful');}

  ngOnInit(): void {
    this.StudentID = sessionStorage.getItem('StudentID');
    this.payfastNumber = JSON.parse(sessionStorage.getItem('payfastNumber')!);
    this.grandTotal = JSON.parse(sessionStorage.getItem('grandtotal')!);
    this.cartObject = JSON.parse(sessionStorage.getItem('cart')!);
    this.NewPurchase();
  }

  Ok(){
    this.router.navigate(['home/student-home']);
  }

NewPurchase(){
let details =  new CartDetails();
details.StudentID =  this.StudentID;
details.PayFastNumber = this.payfastNumber;
details.Total = this.grandTotal;

    this.service.NewCart(details).subscribe((res:any)=>{
    console.log(res);
    if(res.Status === 200){
      this.snack.open(
        'Payment completed successfully!',
              'OK',
              {
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                duration: 3000,
              }
      );
      this.service.NewPurchase(this.payfastNumber,this.cartObject).subscribe((result:any)=>{
        if(result.Status ===200)
        {
          this.snack.open(
            'Enrolled in course/s successfully!',
                  'OK',
                  {
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                    duration: 3000,
                  }
          );
           sessionStorage.removeItem('cart');
        }
        else{
          const dialogReference = this.dialog.open(
            ExistsDialogComponent,
            {
              data: {
                dialogTitle: 'Error',
                dialogMessage: 'Internal server error. Please try again',
                operation: 'ok',
              },
              width: '50vw',
              height:'30vh'
            }
          );
        }
      })
     
    }
    else{
      const dialogReference = this.dialog.open(
        ExistsDialogComponent,
        {
          data: {
            dialogTitle: 'Error',
            dialogMessage: 'Internal server error. Please try again',
            operation: 'ok',
          },
          width: '50vw',
          height:'30vh'
        }
      );
    }
    })
  }

}
