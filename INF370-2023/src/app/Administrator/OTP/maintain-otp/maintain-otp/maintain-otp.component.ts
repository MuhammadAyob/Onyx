import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { OTPTimer } from 'src/app/Models/otp.model';
import { OTPService } from 'src/app/Services/otp.service';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuditLog } from 'src/app/Models/audit.model';
import { AuditLogService } from 'src/app/Services/audit-log.service';
import { SecurityService } from 'src/app/Services/security.service';

@Component({
  selector: 'app-maintain-otp',
  templateUrl: './maintain-otp.component.html',
  styleUrls: ['./maintain-otp.component.scss']
})
export class MaintainOTPComponent implements OnInit {

OTPFormControl = new FormControl('',[Validators.required, Validators.min(1), Validators.pattern('^[0-9][0-9]*$')]);
test:any;
OTPTimer!:OTPTimer;
isLoading:boolean=false;
constructor(
  public router:Router,
  private location:Location,
  private dialog:MatDialog,
  private service:OTPService,
  private titleservice:Title,
  public toastr: ToastrService,
  private snack:MatSnackBar,
  private aService:AuditLogService,
  private security:SecurityService
) {this.titleservice.setTitle('OTP'); }


ngOnInit(): void {
  this.OTPTimer = JSON.parse(sessionStorage['OTPTimer'])
  this.test = JSON.parse(sessionStorage['OTPTimer']);
}

onBack(): void {
  this.router.navigate(['admin/read-otp-timer'])
}

onSubmit() {
  const isInvalid = this.validateFormControls();
  if (isInvalid == true) {
    this.dialog.open(InputDialogComponent, {
      data: {
        dialogTitle: "Input Error",
        dialogMessage: "Correct errors on highlighted fields"
      },
      width: '27vw',
      height: '29vh',
    });
  } else {
    const title = 'Confirm Edit OTP Timer';
    const message = 'Are you sure you want to save changes to the Timer?';
    const popupMessage = 'OTP changes successful!';
    this.showDialog(title, message, popupMessage);
  }
}

showDialog(title: string, message: string, popupMessage: string): void {
  const dialogReference = this.dialog.open(ConfirmDialogComponent, {
    data: {
      dialogTitle: title,
      dialogMessage: message,
      dialogPopupMessage: popupMessage,
      operation: 'add',
      departmentData: this.OTPTimer,
    }, //^captured department info here for validation
    height: '30vh',
    width: '50vw',
  });

  dialogReference.afterClosed().subscribe((result) => {
    this.isLoading = true;
    if (result == true) {
      this.service
        .MaintainOTPTimer(this.OTPTimer.ID, this.OTPTimer)
        .subscribe((result:any) => {
          console.log(result);
          if (result.Status === 200) 
          {
            this.snack.open(
              'Timer updated successfully!',
                    'OK',
                    {
                      horizontalPosition: 'center',
                      verticalPosition: 'bottom',
                      duration: 3000,
                    }
            );
            this.router.navigate(['admin/read-otp-timer']);
            this.isLoading = false;
            let audit = new AuditLog();

              audit.AuditLogID = 0;
              audit.UserID = this.security.User.UserID;
              audit.AuditName = 'Configure OTP Timer';
              audit.Description = 'Employee, ' + this.security.User.Username + ', edited the minutes till expiry from: ' + this.test.MinutesUntilExpiry + ' minutes to ' + this.OTPTimer.MinutesUntilExpiry + ' minutes.'
              audit.Date = '';

          this.aService.AddAudit(audit).subscribe((data) => {
          })       

          }
          else
          {
            this.isLoading = false;
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
        });
    }
  });
}

validateFormControls(): boolean {
  if (
    this.OTPFormControl.hasError('required') == false &&
    this.OTPFormControl.hasError('pattern') == false && 
    this.OTPFormControl.hasError('min') == false
  )
  {return false}
  else
  {return true}
}

}
