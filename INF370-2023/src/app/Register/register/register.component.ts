import { Component, OnInit } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { User } from 'src/app/Models/user.model';
import { Student } from 'src/app/Models/student.model';
import { StudentDetails } from 'src/app/Models/student-details.model';
import { StudentService } from 'src/app/Services/student.service';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Titles } from 'src/app/Models/title.model';
import { TitleService } from 'src/app/Services/title.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
nameFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[a-zA-Z ]*$'),
]);
surnameFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[a-zA-Z ]*$'),
]);
emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
]);
phoneFormControl = new FormControl('', [
  Validators.required,
  Validators.pattern('^0[1-9]\\d{8}$'),
]);
passwordFormControl = new FormControl('', [
  Validators.required,
  Validators.minLength(6),
  Validators.maxLength(16),
  Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$')
]);
confirmPasswordFormControl = new FormControl('', [
  Validators.required,
  Validators.minLength(6),
  Validators.maxLength(16),
  Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$')
]);
titleFormControl = new FormControl('', [Validators.required]);

hide: boolean = true;
student!:StudentDetails;
titleList!:Titles[];
confirmPassword!:string;
isLoading = false;
constructor(
  public router: Router,
  private location: Location,
  private titleservice: Title,
  private service: StudentService,
  private dialog: MatDialog,
  public toastr: ToastrService,
  private snack:MatSnackBar,
  private serviceT:TitleService
) { this.titleservice.setTitle('Register'); }

ngOnInit(): void {
this.getTitleList();
this.refreshForm();
}

refreshForm() {
  this.student = {
    TitleID: 0,
    Name: '',
    Surname: '',
    Email: '',
    Phone: '',
    Password:''
  };

}

getTitleList(){
  this.serviceT.GetTitles().subscribe((result)=>{
    this.titleList=result as Titles[];
   });
 }

 onArrowBack(): void {
  this.location.back();
}

onBack() {
  this.location.back();
}

selectTitle($event:any) {
  this.student.TitleID = $event;
}

onSubmit() {
  const isInvalid = this.validateFormControls();

  if (isInvalid == true) {
    this.dialog.open(InputDialogComponent, {
      data: {
        dialogTitle: 'Registration Error',
        dialogMessage: 'Ensure all fields are filled and in the desired format',
        operation: 'ok',
      },
      width: '50vw',
      height: '30vh',
    });
  } 
  else if (this.student.Password != this.confirmPassword) {
    this.dialog.open(InputDialogComponent, {
      data: {
        dialogTitle: 'Error',
        dialogMessage: 'Password and Confirm Password Fields are not matching!',
        operation: 'ok',
      },
      width: '50vw',
      height:'30vh'
    });
  } 
    
else 
{
const title = 'Confirm details';
const message = 'Are you sure you want to register?';
this.showDialog(title, message);
}
  
}




validateFormControls(): boolean {
  if (
    this.nameFormControl.hasError('required') == false &&
    this.nameFormControl.hasError('pattern') == false &&
    this.titleFormControl.hasError('required')==false &&
    this.surnameFormControl.hasError('required') == false &&
    this.surnameFormControl.hasError('pattern') == false &&
    this.emailFormControl.hasError('required') == false &&
    this.emailFormControl.hasError('email') == false &&
    this.phoneFormControl.hasError('required') == false &&
    this.phoneFormControl.hasError('pattern') == false &&
    this.passwordFormControl.hasError('required') == false &&
    this.passwordFormControl.hasError('minlength') == false &&
    this.passwordFormControl.hasError('maxlength') == false &&
    this.passwordFormControl.hasError('pattern') == false &&
    this.confirmPasswordFormControl.hasError('required') == false &&
    this.confirmPasswordFormControl.hasError('minlength') == false &&
    this.confirmPasswordFormControl.hasError('maxlength') == false &&
    this.confirmPasswordFormControl.hasError('pattern') == false
  ) {
    return false;
  } else {
    return true;
  }
}

showDialog(title: string, message: string): void {
  const dialogReference = this.dialog.open(ConfirmDialogComponent, {
    data: {
      dialogTitle: title,
      dialogMessage: message,
      operation: 'add',
    },
    width: '50vw',
    height:'30vh'
  });

  dialogReference.afterClosed().subscribe((result) => {
    if (result == true) {
      this.isLoading = true;
      this.service.AddStudent(this.student).subscribe((result:any) => 
      {
        this.isLoading = false;
       console.log(result);
       if(result.Status===200)
       {
        this.snack.open(
          'Registration successful! Please Login with your email and password.',
                'OK',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom',
                  duration: 5500,
                }
        );
        this.router.navigate(['login']);
        this.refreshForm();
       }
       else if(result.Status===400)
       {
        const dialogReference = this.dialog.open(ExistsDialogComponent, {
          data: {
            dialogTitle: 'Error',
            dialogMessage: 'Invalid data, please ensure data is in the correct format',
            operation: 'ok',
          },
          width: '50vw',
          height:'30vh'
        });
       }
       else if(result.Status===401)
       {
        const dialogReference = this.dialog.open(ExistsDialogComponent, {
          data: {
            dialogTitle: 'Email in use!',
            dialogMessage: 'Email is currently in use in the system, please enter a different Email.',
            operation: 'ok',
          },
          width: '50vw',
          height:'30vh'
        });
       }
       else if(result.Status===402)
       {
        const dialogReference = this.dialog.open(ExistsDialogComponent, {
          data: {
            dialogTitle: 'Phone in use!',
            dialogMessage: 'Phone number is currently in use in the system, please enter a different Email.',
            operation: 'ok',
          },
          width: '50vw',
          height:'30vh'
        });
       }
       else if(result.Status===600)
       {
        const dialogReference = this.dialog.open(ExistsDialogComponent, {
          data: {
            dialogTitle: 'Title not selected!',
            dialogMessage: 'Please select a Title from the Title dropdow',
            operation: 'ok',
          },
          width: '50vw',
          height:'30vh'
        });
       }
       else
       {
        const dialogReference = this.dialog.open(ExistsDialogComponent, {
          data: {
            dialogTitle: 'Error',
            dialogMessage: 'Internal server error',
            operation: 'ok',
          },
          width: '50vw',
          height:'30vh'
        });
       }

      }
      );
    }
  });
}

}
