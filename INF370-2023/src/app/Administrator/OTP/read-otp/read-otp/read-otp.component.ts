import { Component, OnInit } from '@angular/core';
import { FormControl , Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { OTPTimer } from 'src/app/Models/otp.model';
import { OTPService } from 'src/app/Services/otp.service';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-read-otp',
  templateUrl: './read-otp.component.html',
  styleUrls: ['./read-otp.component.scss']
})
export class ReadOTPComponent implements OnInit {

OTPTimer:any;

constructor(
  public router:Router,
  private location:Location,
  private service:OTPService,
  private _snackBar:MatSnackBar,
  private titleservice:Title
) { this.titleservice.setTitle('OTP'); }

ngOnInit(): void {
  this.GetOTP();
}


GetOTP(){
  this.service.GetOTPTimer().subscribe((result) => {
    this.OTPTimer = result as any;
    sessionStorage['OTPTimer'] = JSON.stringify(result);
  });

}

onEdit() {
this.router.navigate(['admin/maintain-otp-timer']);
}

onBack(): void {
  this.router.navigate(['home/admin-home']);
}

}
