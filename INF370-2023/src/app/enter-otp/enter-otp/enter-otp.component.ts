import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SecurityService } from 'src/app/Services/security.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/Models/user.model';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-enter-otp',
  templateUrl: './enter-otp.component.html',
  styleUrls: ['./enter-otp.component.scss']
})
export class EnterOtpComponent implements OnInit {
User!: User;
formData!: User;
hide: boolean = true;
confirmPassword!: string;
isLoading = false;

constructor(
  private fb: FormBuilder,
    private security: SecurityService,
    private router: Router,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private titleservice:Title,
    private snack:MatSnackBar
) {this.titleservice.setTitle('OTP'); }

OTPFormControl = new FormControl('', [Validators.required, Validators.pattern('^[1-9][0-9]*$')]);
passwordFormControl = new FormControl('', [Validators.required,Validators.maxLength(16) ,Validators.minLength(6)],);
confirmPasswordFormControl = new FormControl('', [Validators.required, Validators.maxLength(16),Validators.minLength(6)],);

  ngOnInit(): void {
    this.otpForm();
  }

  validateFormControls(): boolean {  
    const isValidPassword = this.passwordFormControl.hasError('required') || this.passwordFormControl.hasError('minlength') || this.passwordFormControl.hasError('maxlength')
    const isValidOTP = this.OTPFormControl.hasError('required') || this.OTPFormControl.hasError('pattern')
    const isValidConfirmPassword = this.confirmPasswordFormControl.hasError('required') || this.confirmPasswordFormControl.hasError('minlength') || this.confirmPasswordFormControl.hasError('maxlength')
    const isMatch: boolean = this.formData.Password === this.confirmPassword;
    if (
      isValidPassword == false &&
      isValidConfirmPassword == false &&
      isValidOTP == false &&
      isMatch == true
    ){ return false}
    else
    {return true}

  }

  onOTP(form: NgForm) {
    const isInvalid = this.validateFormControls();
    if (isInvalid == true) {
      this.dialog.open(InputDialogComponent, {
        data: {
          dialogTitle: 'Reset Password error',
          dialogMessage: 'Correct errors, and ensure password are matching',
          operation: 'ok',
        },
        width: '50vw',
        height:'35vh'
      });
    } else{
      if(this.formData.Password == this.confirmPassword) {
        //console.log(form)
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
             
        
              this.OTP(form);
             
            }, 2000);
          }
        });
        
      }
    }   
  }

  otpForm(form?: NgForm) {
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

  OTP(form: NgForm) {
    // console.log(this.formData.ResetPasswordOTP)
    // console.log(this.formData)
    this.security.newPassword(this.formData).subscribe((res: any) => {    
      console.log(res);

      if(res.Status===200)
      {
        this.isLoading=false;
        this.snack.open(
          'Password has been reset successfully!',
                'OK',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom',
                  duration: 5000,
                }
        );
        this.router.navigateByUrl('login');
      }
      else if(res.Status===300)
      {
        this.isLoading=false;
        const dialogReference = this.dialog.open(
          ExistsDialogComponent,
          {
            data: {
              dialogTitle: 'OTP Expired',
              dialogMessage: 'Your One-time-Pin has expired. Please request a new OTP.',
              operation: 'ok',
            },
            width: '50vw',
            height:'30vh'
           
          }
        );
      }
      else if(res.Status === 500)
      {
        this.isLoading=false;
        const dialogReference = this.dialog.open(
          ExistsDialogComponent,
          {
            data: {
              dialogTitle: 'Error',
              dialogMessage: 'You do not have permission to reset your password, please submit a request on the reset password page.',
              operation: 'ok',
            },
            width: '50vw',
            height:'35vh'
           
          }
        );
      }
      else if(res.Status === 700)
      {
        this.isLoading=false;
        const dialogReference = this.dialog.open(
          ExistsDialogComponent,
          {
            data: {
              dialogTitle: 'Error',
              dialogMessage: 'Password cannot be the same as old password. Please enter a different password.',
              operation: 'ok',
            },
            width: '50vw',
            height:'35vh'
           
          }
        );
      }

      else 
      {
        this.isLoading=false;
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

  OTPsuccess() {
    this.toastr.success(
      'Password has been successfully Changed.',
      'Password Changed Successfully'
    );
  }

  OTPFail() {
    this.toastr.error(
      'Please ensure that you enter a valid OTP',
      'Invalid OTP'
    );
  }

}
