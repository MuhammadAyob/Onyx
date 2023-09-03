import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SecurityService } from 'src/app/Services/security.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/Models/user.model';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { DatePipe } from '@angular/common';
import { timer } from 'rxjs';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { AuditLog } from 'src/app/Models/audit.model';
import { AuditLogService } from 'src/app/Services/audit-log.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers:[DatePipe]
})
export class LoginComponent implements OnInit {
  hide: boolean = true;
  User!: User;
  formData!: User;
  isLoading = false;  
  
  emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  
  loginForm: FormGroup = this.fb.group({
    Username: ['', [Validators.required, Validators.email]],
    Password: ['', [Validators.required, Validators.minLength(6),Validators.maxLength(16)]],
  });

  constructor(
    private fb: FormBuilder,
    private security: SecurityService,
    private router: Router,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private aService:AuditLogService,
    private datePipe:DatePipe,
    private titleservice:Title
  ) { this.titleservice.setTitle('Login'); }

  ngOnInit(): void {
    const delay = (ms:number) => new Promise(res => setTimeout(res, ms));

    this.resetForm();
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

  validateFormControls(): boolean {
    if (this.loginForm.controls['Username'].valid && this.loginForm.controls['Password'].valid)
    {return false}
    else
    {return true}
  }
  
  onRegister(){
    this.router.navigate(['register-student'])
  }
  
  onLogin(form: any) {
    const isInvalid = this.validateFormControls();
    if (isInvalid == true) {
      this.dialog.open(InputDialogComponent, {
        data: {
          dialogTitle: "Input Error",
          dialogMessage: "Correct Errors on highlighted fields"
        },
        width: '27vw',
        height: '29vh',
      });
    } else {
     //this.isLoading = true;
      setTimeout(() => {
        console.log("hits");   
        this.login(form);
      }, 500);

    }
   
  }
  
  login(form:any) {
    this.isLoading = true;
    this.security.Login(form.value).then((res: any) => {
      console.log(res);
      if (this.security.User.UserRoleID === 1) {
        this.security.getEmployeeID(this.security.User.UserID).subscribe(
          (result) => {
            sessionStorage.setItem('EmployeeID', JSON.stringify(result));
            this.isLoading = false;
            this.router.navigateByUrl('home/admin-home');

             // Audit Log 

             let audit = new AuditLog();
             audit.AuditLogID = 0;
             audit.UserID = this.security.User.UserID;
             audit.AuditName = 'Login';
             audit.Description = 'User, ' + this.security.User.Username + ', logged into the system.'
             audit.Date = this.datePipe.transform(new Date(), 'yyyy/MM/dd');
 
             this.aService.AddAudit(audit).subscribe((data) => {
               //console.log(data);
             })
            
          });
  
      }
      else if (this.security.User.UserRoleID === 2) {
        this.security.getEmployeeID(this.security.User.UserID).subscribe(
          (result) => {
            sessionStorage.setItem('EmployeeID', JSON.stringify(result));
            this.isLoading = false;
            this.router.navigateByUrl('home/employee-home');

              // Audit Log 

              let audit = new AuditLog();
              audit.AuditLogID = 0;
              audit.UserID = this.security.User.UserID;
              audit.AuditName = 'Login';
              audit.Description = 'User ' + this.security.User.Username + ' logged into the system.'
              audit.Date = this.datePipe.transform(new Date(), 'yyyy/MM/dd');
  
              this.aService.AddAudit(audit).subscribe((data) => {
                console.log(data);
              })
          });
  
      }
      else if (this.security.User.UserRoleID === 3) {
        this.security.getStudentID(this.security.User.UserID).subscribe(
          (result) => {
            sessionStorage.setItem('StudentID', JSON.stringify(result));
            this.isLoading = false;
            this.router.navigateByUrl('home/student-home');

             // Audit Log 

             let audit = new AuditLog();
             audit.AuditLogID = 0;
             audit.UserID = this.security.User.UserID;
             audit.AuditName = 'Login';
             audit.Description = 'User ' + this.security.User.Username + ' logged into the system.'
             audit.Date = this.datePipe.transform(new Date(), 'yyyy/MM/dd');
 
             this.aService.AddAudit(audit).subscribe((data) => {
               console.log(data);
             })
          });
  
      }
      
   }, (error: HttpErrorResponse) => {
    if (error.error.Message == "Your Account is Disabled") {
      this.isLoading = false;
      const dialogReference = this.dialog.open(
        ExistsDialogComponent,
        {
          data: {
            dialogTitle: 'Account disabled',
            dialogMessage: 'Please email us at dseiqueries@gmail.com to reactivate your account.',
            operation: 'ok',
          },
          width: '50vw',
          height:'30vh'
  
        }
      );
      this.toastr.error(error.error.Message, "Error");
  
     }
  
     else if (error.error.Message != null)
     {
      this.isLoading = false;
      const dialogReference = this.dialog.open(
        ExistsDialogComponent,
        {
          data: {
            dialogTitle: 'Error',
            dialogMessage: 'Invalid username or password. Please try again',
            operation: 'ok',
          },
          width: '50vw',
          height:'30vh'
  
        }
      );
      this.toastr.error(error.error.Message, "Error");
     }
  
     else {
      this.isLoading = false;
       this.toastr.error("The system cannot establish a connection with the database!", "Error");
     }
  });
  }

}
