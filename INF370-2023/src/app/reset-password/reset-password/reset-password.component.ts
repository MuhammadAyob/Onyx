import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SecurityService } from 'src/app/Services/security.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/Models/user.model';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { Title } from '@angular/platform-browser';
import { TitleService } from 'src/app/Services/title.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
User!: User;
formData!: User;
isLoading = false;

constructor(
  private fb: FormBuilder,
    private security: SecurityService,
    private router: Router,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private titleservice:Title,
    private snack:MatSnackBar
) { this.titleservice.setTitle('Reset Password'); }

hide: boolean = true;
emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

ResetForm: FormGroup = this.fb.group({
  Username: ['', [Validators.required, Validators.email]],
});

ngOnInit(): void {
  this.resetForm();
}


validateFormControls(): boolean {
  if (this.ResetForm.controls['Username'].valid)
  {return false}
  else
  {return true}
}


resetForm(form?: NgForm) {
  this.formData = {
    UserID: 0,
    UserRoleID: 0,
    Username: '',
    Password: '',
    GUID: '',
    Activity: '',
    OTP: 0,
    OTPExpiry:null
  };
}
onReset(form: any) {
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
    const dialogReference = this.dialog.open(ConfirmDialogComponent, {
      data: {
        dialogTitle: 'Confirm Sending OTP',
        dialogMessage: 'Are you sure you want to reset your password?',
        operation: 'add',
        skillData: this.formData,
      }, //^captured department info here for validation
      width: '50vw',
      height:'30vh'
    });

    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        this.isLoading = true;
  
        setTimeout(() => {
          console.log("hits");
         
    
          this.Reset(form);
         
        }, 1000);
      }
    });
  }
 

 
}

Reset(form: any) {
  this.security.resetEmail(form.value).subscribe((res: any) => {
      console.log(res);
      if (res.Status === 200) 
      {
        this.snack.open(
          'Password reset OTP has been sent to your email.',
                'OK',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom',
                  duration: 5500,
                }
        );
        this.isLoading = false;
        this.router.navigate(['enter-otp']);
      } 
      else if (res.Status === 404)
      {
        this.isLoading = false;
        const dialogReference = this.dialog.open(
          ExistsDialogComponent,
          {
            data: {
              dialogTitle: 'Error',
              dialogMessage: 'Email does not exist in database, please enter the email associated with your account.',
              operation: 'ok',
            },
            width: '50vw',
            height:'35vh'
          }
        );
       
      }
      else
      {
        this.isLoading = false;
        const dialogReference = this.dialog.open(
          ExistsDialogComponent,
          {
            data: {
              dialogTitle: 'Error',
              dialogMessage: 'Internal server error, please try again',
              operation: 'ok',
            },
            width: '50vw',
            height:'30vh'
          }
        );
      }
    });
}

sendEmail() {
  this.toastr.success(
    'Password recovery OTP as been sent to your email.',
    'Email Sent'
  );
}

sendEmailFail() {
  this.toastr.error(
    'Please ensure that you enter a valid email address',
    'Invalid Email Address'
  );
}
}
