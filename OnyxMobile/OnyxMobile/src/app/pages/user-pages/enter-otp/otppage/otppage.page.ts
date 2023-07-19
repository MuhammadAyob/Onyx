import { Component, OnInit } from '@angular/core';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators, NgForm, FormControl } from '@angular/forms';
import { User } from 'src/app/Models/user.model';
import { SecurityService } from 'src/app/Services/security.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-otppage',
  templateUrl: './otppage.page.html',
  styleUrls: ['./otppage.page.scss'],
})
export class OtppagePage implements OnInit {
  User!: User;
  formData!: User;
  hide: boolean = true;
  confirmPassword!: string;
  isLoading = false;
  
  constructor( 
      private titleservice: Title,
      private fb: FormBuilder,
      private security: SecurityService,
      private router: Router,
      private alertController: AlertController,
      private toastController:ToastController) 
  { this.titleservice.setTitle('Enter OTP');}
  
  OTPFormControl = new FormControl('', [Validators.required, Validators.pattern('^[1-9][0-9]*$')]);
  passwordFormControl = new FormControl('', [Validators.required,Validators.maxLength(16) ,Validators.minLength(6)],);
  confirmPasswordFormControl = new FormControl('', [Validators.required, Validators.maxLength(16),Validators.minLength(6)],);
  
  ngOnInit():void {
    this.otpForm();
  }
  
  otpForm() {
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
  
  async onOTP() {
    const isInvalid = this.validateFormControls();
    if (isInvalid == true) {
  
      const alert = await this.alertController.create({
        header: 'Reset Password error',
        message: 'Correct highlighted errors, and/or ensure passwords are matching',
        buttons: ['OK'],
      });
  
      await alert.present();
     
    } 
    else
    {
      if(this.formData.Password == this.confirmPassword) {
        //console.log(form)
        const alert = await this.alertController.create({
          header: "Confirm Sending OTP",
          message: "Are you sure you want to reset your password?",
          buttons: [
            {
              text: "Cancel",
              role: "cancel"
            },
            {
              text: "OK",
              handler: () => {
                this.isLoading = true;
      
            setTimeout(() => {
              console.log("hits");
             
        
              this.OTP();
             
            }, 500);
    
              }
            }
          ]
        });
        alert.present();
  
        
      }
    }   
  }
  
  OTP() {
    // console.log(this.formData.ResetPasswordOTP)
    // console.log(this.formData)
    this.security.newPassword(this.formData).subscribe(async (res: any) => {    
      console.log(res);
  
      if(res.Status===200)
      {
        this.isLoading=false;
        const toast = await this.toastController.create({
          message: 'Password has been reset successfully!',
          duration: 5500,
          position: 'bottom',
        });
    
        await toast.present();
    
        this.router.navigateByUrl('login');
      }
      else if(res.Status===300)
      {
        this.isLoading=false;
        const alert = await this.alertController.create({
          header: 'OTP Expired',
          message: 'Your One-time-Pin has expired. Please request a new OTP.',
          buttons: ['OK'],
        });
    
        await alert.present();
      
      }
      else if(res.Status === 500)
      {
        this.isLoading=false;
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'You do not have permission to reset your password, please submit a request on the reset password page.',
          buttons: ['OK'],
        });
    
        await alert.present();
        
      }
      else if(res.Status === 700)
      {
        this.isLoading=false;
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Password cannot be the same as old password. Please enter a different password.',
          buttons: ['OK'],
        });
    
        await alert.present();
     
      }
  
      else 
      {
        this.isLoading=false;
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Internal server error. Please try again.',
          buttons: ['OK'],
        });
    
        await alert.present();
      
      }
    });
  }
}
