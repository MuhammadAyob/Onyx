import { Component, OnInit } from '@angular/core';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators, NgForm, FormControl } from '@angular/forms';
import { User } from 'src/app/Models/user.model';
import { SecurityService } from 'src/app/Services/security.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent  implements OnInit {
  User!: User;
  formData!: User;
  isLoading = false;

  UsernameFormControl = new FormControl('', [Validators.required, Validators.email]);

  constructor( 
  private titleservice: Title,
  private fb: FormBuilder,
  private security: SecurityService,
  private router: Router,
  private alertController: AlertController,
  private toastController:ToastController)
   {this.titleservice.setTitle('Reset Password'); }

  ngOnInit():void {
    this.resetForm();
  }

  resetForm() {
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
    if (
      this.UsernameFormControl.hasError('required') == false && 
      this.UsernameFormControl.hasError('email') == false 
    )
    {return false}
    else
    {return true}
  }

  async onReset() {
    const isInvalid = this.validateFormControls();
    if (isInvalid == true) {
      const alert = await this.alertController.create({
        header: 'Input Error',
        message: 'Correct the highlighted errors on the fields!',
        buttons: ['OK'],
      });
  
      await alert.present();

    } else {
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
           
      
            this.Reset();
           
          }, 500);
  
            }
          }
        ]
      });
      alert.present();
    }
   
  
   
  }

  Reset() {
    this.security.resetEmail(this.formData).subscribe(async (res: any) => {
        console.log(res);
        if (res.Status === 200) 
        {
          const toast = await this.toastController.create({
            message: 'Password reset OTP has been sent to your email.',
            duration: 5500,
            position: 'bottom',
          });
      
          await toast.present();
          this.isLoading = false;
          this.router.navigate(['enter-otp']);
        } 
        else if (res.Status === 404)
        {
          this.isLoading = false;
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'Email does not exist in database, please enter the email associated with your account.',
            buttons: ['OK'],
          });
      
          await alert.present();
      
         
        }
        else
        {
          this.isLoading = false;
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'Internal server error, please try again',
            buttons: ['OK'],
          });
      
          await alert.present();
        
        }
      });
  }

}
