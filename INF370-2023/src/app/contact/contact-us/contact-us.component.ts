import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { Contact } from 'src/app/Models/contact.model';
import { CourseService } from 'src/app/Services/course.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})

export class ContactUsComponent implements OnInit {
nameFormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]);
queryFormControl = new FormControl('', [Validators.required]);
emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
]);

contact!:Contact;
isLoading=false;
constructor(
  public router: Router,
  private location: Location,
  private dialog: MatDialog,
  private snack: MatSnackBar,
  private titleservice: Title,
  private service:CourseService) 
  { this.titleservice.setTitle('Submit Contact Query');}

ngOnInit(): void {
  this.refreshForm();
}

refreshForm(){
  this.contact ={
    ContactID:0,
    Name:'',
    Email:'',
    Query:''
  }
}

onSubmit() {
  console.log(this.contact);
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
    const title = 'Confirm Query';
    const message = 'Are you sure you want to submit this query?';
    this.showDialog(title, message);
  }
}

validateFormControls(): boolean {
  if (
    this.nameFormControl.hasError('required') == false &&
    this.nameFormControl.hasError('pattern') == false &&
    this.emailFormControl.hasError('required') == false &&
    this.emailFormControl.hasError('email') == false &&
    this.queryFormControl.hasError('required') == false 
   

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
      applicantData: this.contact,
    }, //^captured department info here for validation
    width: '50vw',
    height:'30vh'
  });

  dialogReference.afterClosed().subscribe((result) => {
    if (result == true) {
      this.isLoading = true;
      //console.log(this.test + 'hit')
      this.service.SendContactQuery(this.contact).subscribe(
        (result:any) => 
        {
          this.isLoading = false;
          //console.log(result);
          if(result.Status === 200)
          {
            this.snack.open(
              'Query submitted successfully!',
                    'OK',
                    {
                      horizontalPosition: 'center',
                      verticalPosition: 'bottom',
                      duration: 5000,
                    }
            );
            this.refreshForm();
            this.router.navigate(['home']);
          }
       
          
          else
          {
            const dialogReference = this.dialog.open(ExistsDialogComponent, {
              data: {
                dialogTitle: 'Error',
                dialogMessage: 'Internal server error. Please try again',
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

onBack() {
  this.router.navigate(['home']);
}

}
