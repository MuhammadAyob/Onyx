import { UpdateProfileService } from 'src/app/Services/update-profile.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { Student } from 'src/app/Models/student.model';
import { StudentService } from 'src/app/Services/student.service';
import { TitleService } from 'src/app/Services/title.service';
import { SecurityService } from 'src/app/Services/security.service';
import { Titles } from 'src/app/Models/title.model';
import { AuditLog } from 'src/app/Models/audit.model';
import { AuditLogService } from 'src/app/Services/audit-log.service';

@Component({
  selector: 'app-student-profile-update',
  templateUrl: './student-profile-update.component.html',
  styleUrls: ['./student-profile-update.component.scss']
})
export class StudentProfileUpdateComponent implements OnInit {
titleFormControl = new FormControl('',Validators.required);
nameFormControl = new FormControl('', [Validators.required,Validators.pattern('^[a-zA-Z ]*$')]);
surnameFormControl = new FormControl('', [Validators.required,Validators.pattern('^[a-zA-Z ]*$'),]);
emailReqFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
]);
phoneFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^0[1-9]\\d{8}$'),
]);

student!:Student;
hide:boolean=true;
titleList!:Titles[];
isLoading!:boolean;

constructor(
  public router: Router,
  private location: Location,
  private titleservice: Title,
  public toaster: ToastrService,
  private toastr: ToastrService,
  private dialog: MatDialog,
  private service: UpdateProfileService,
  private serviceT:TitleService,
  private serviceS:StudentService,
  private serviceX: SecurityService,
  private snack:MatSnackBar,
  private aService:AuditLogService
) { this.titleservice.setTitle('Your Profile');}

ngOnInit(): void {
  this.onStudentProfile();
  this.getTitleList();
}

GetHelp(){
  localStorage.removeItem('pageNumber');
  localStorage.setItem('pageNumber', '4');
}

getTitleList(){
  this.serviceT.GetTitles().subscribe((result)=>{
    this.titleList=result as Titles[];
  });
 }

onStudentProfile(){
  this.serviceX.getStudentName(sessionStorage.getItem('StudentID')).subscribe((result:any) => {
    this.student = result as any;
  });
}

onBack() {
  this.router.navigate(['home/student-home']);
}


validateFormControls(): boolean {
  if (
    this.surnameFormControl.hasError('required' && 'pattern') == false &&
    this.nameFormControl.hasError('required' && 'pattern') == false &&
    this.phoneFormControl.hasError('required' && 'pattern')== false &&
    this.emailReqFormControl.hasError('required' && 'email') == false &&
    this.titleFormControl.hasError('required') == false
  )
  { return false}
  else
  {return true}
}

onSubmit() {
//console.log(this.student);
  const isInvalid = this.validateFormControls();
  if (isInvalid == true) {
    this.dialog.open(InputDialogComponent, {
      data: {
        dialogTitle: "Input Error",
        dialogMessage: "Correct Errors on highlighted fields"
      },
      width: '25vw',
      height: '27vh',
    });
  } else {
      const dialogReference = this.dialog.open(ConfirmDialogComponent, {
        data: {
          dialogTitle: 'Update Profile',
          dialogMessage: 'Are you sure you want to update your details?',
        },
        width: '50vw',
        height:'30vh'
      });

      dialogReference.afterClosed().subscribe((result) => {
        if (result == true) {
          this.isLoading=true;
          this.service.UpdateStudentProfile(this.student.StudentID, this.student).subscribe((result:any) => 
        {
          if(result.Status===200)
          {
            this.snack.open(
              'Your profile was updated successfully!',
                    'OK',
                    {
                      horizontalPosition: 'center',
                      verticalPosition: 'bottom',
                      duration: 3000,
                    }
            );
           this.isLoading=false;
           this.router.navigate(['home/student-home']);

               // Audit Log 

               let audit = new AuditLog();
               audit.AuditLogID = 0;
               audit.UserID = this.serviceX.User.UserID;
               audit.AuditName = 'Update Profile';
               audit.Description = 'Student, ' + this.student.Email + ', updated their user profile.'
               audit.Date = '';
   
               this.aService.AddAudit(audit).subscribe((data) => {
                 //console.log(data);
               })
               
          }
          else if(result.Status===400)
          {
            this.isLoading=false;
            const dialogReference = this.dialog.open(
              ExistsDialogComponent,
              {
                data: {
                  dialogTitle: 'Invalid data',
                  dialogMessage:
                    'Please ensure data is in the correct format',
                  operation: 'ok',
                },
                width: '50vw',
                height:'30vh'
              }
            );
          }
          else if(result.Status === 404)
          {
            this.isLoading=false;
            const dialogReference = this.dialog.open(
              ExistsDialogComponent,
              {
                data: {
                  dialogTitle: 'Email in use!',
                  dialogMessage:
                    'Please enter a different email',
                  operation: 'ok',
                },
                width: '50vw',
                height:'30vh'
              }
            );
          }
          else if(result.Status === 405)
          {
            this.isLoading=false;
            const dialogReference = this.dialog.open(
              ExistsDialogComponent,
              {
                data: {
                  dialogTitle: 'Phone in use!',
                  dialogMessage:'Please enter a different Phone Number.',
                  operation: 'ok',
                },
                width: '50vw',
                height:'30vh'
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
                  dialogMessage:
                    'Internal server error. Please try again',
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
}

}
