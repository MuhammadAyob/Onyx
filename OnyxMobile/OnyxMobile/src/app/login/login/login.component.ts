import { Component, OnInit } from '@angular/core';
import { AlertController, NavController,IonicModule } from '@ionic/angular';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators, NgForm, FormControl } from '@angular/forms';
import { User } from 'src/app/Models/user.model';
import { SecurityService } from 'src/app/Services/security.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  implements OnInit {

formData!: User;
hide: boolean = true;
User!: User;
isLoading = false;  
  
emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  
UsernameFormControl = new FormControl('', [Validators.required, Validators.email]);
PasswordFormControl = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]);

constructor(
  private titleservice: Title,
  private fb: FormBuilder,
  private security: SecurityService,
  private router: Router,
  private alertController: AlertController,
  public navCtrl: NavController) 

  {this.titleservice.setTitle('Login'); }

  ngOnInit():void {
    this.resetForm();
    console.log('init');
    this.resetControls();
  }

  ionViewWillEnter():void{
    //const delay = (ms:number) => new Promise(res => setTimeout(res, ms));
    this.resetForm();
    console.log('login');
    this.resetControls();
  }

resetControls()
{
this.UsernameFormControl.reset();
this.PasswordFormControl.reset();
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
      this.UsernameFormControl.hasError('email') == false &&
      this.PasswordFormControl.hasError('required') == false &&
      this.PasswordFormControl.hasError('minlength') == false &&
      this.PasswordFormControl.hasError('maxlength') == false
    )
    {return false}
    else
    {return true}
  }

  async onLogin() {
    const isInvalid = this.validateFormControls();
    if (isInvalid == true) {
      const alert = await this.alertController.create({
        header: 'Input Error',
        subHeader: 'Correct errors',
        message: 'Correct the highlighted errors on the fields!',
        buttons: ['OK'],
      });
  
      await alert.present();
    } 
    else {
     //this.isLoading = true;
      setTimeout(() => {
        console.log("hits");   
        this.login();
      }, 500);

    }
   
  }
  
   login() {
    this.isLoading = true;
    this.security.Login(this.formData).then(async (res: any) => {
      console.log(res);
      if (this.security.User.UserRoleID === 1) {
        sessionStorage.clear();
        this.security.User = new User();
        this.isLoading = false;
        const alert = await this.alertController.create({
          header: 'You are not supposed to be here!',
          message: 'You are a administrator user role! Head over to the website to login',
          buttons: ['OK'],
        });
    
        await alert.present();
       

      }

      else if (this.security.User.UserRoleID === 2) {
        this.security.getEmployeeID(this.security.User.UserID).subscribe(
          (result) => {
            sessionStorage.setItem('EmployeeID', JSON.stringify(result));
            this.isLoading = false;
            this.router.navigateByUrl('/employee-home');
          });
  
      }
      else if (this.security.User.UserRoleID === 3) {
        sessionStorage.clear();
        this.security.User = new User();
       this.isLoading = false;
       const alert = await this.alertController.create({
          header: 'You are not supposed to be here!',
          message: 'You are a student user role! Head over to the website to login',
          buttons: ['OK'],
        });
    
        await alert.present();
       
      }
   
    }, async (error: HttpErrorResponse) => {
    if (error.error.Message == "Your Account is Disabled") {
      this.isLoading = false;
      const alert = await this.alertController.create({
         header: 'Error',
         subHeader: 'Your account has been disabled!',
         message: 'Please email us at dseiqueries@gmail.com to reactivate your account.',
         buttons: ['OK'],
       });
   
      await alert.present();
     }
  
     else if (error.error.Message != null)
     {
      this.isLoading = false;
      const alert = await this.alertController.create({
         header: 'Error',
         message: 'Invalid username or password. Please try again',
         buttons: ['OK'],
       });
   
      await alert.present();

     }
  
     else {
      this.isLoading = false;
      const alert = await this.alertController.create({
         header: 'Error',
         message: 'The system cannot establish a connection with the database!',
         buttons: ['OK'],
       });
   
      await alert.present();
     }
  });
  }

}
