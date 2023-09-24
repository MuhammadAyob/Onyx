import { Section } from 'src/app/Models/section.model';
import { Lesson } from 'src/app/Models/lesson.model';
import { LessonService } from 'src/app/Services/lesson.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { AuditLogService } from 'src/app/Services/audit-log.service';
import { AuditLog } from 'src/app/Models/audit.model';
import { SecurityService } from 'src/app/Services/security.service';

@Component({
  selector: 'app-maintain-lesson',
  templateUrl: './maintain-lesson.component.html',
  styleUrls: ['./maintain-lesson.component.scss']
})
export class MaintainLessonComponent implements OnInit {
lesson!: Lesson;
storageSection: any;
storageCourse:any;
storageLesson:any;
gettingLesson:boolean=true;

nameFormControl = new FormControl('', [Validators.required]);
descFormControl = new FormControl('', [Validators.required]);
videoFormControl = new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]);

isLoading:boolean=false;

constructor(
  public router: Router,
  private location: Location,
  private dialog: MatDialog,
  private serviceL: LessonService,
  private snack:MatSnackBar,
  public toastr: ToastrService,
  private titleservice: Title,
  private aService:AuditLogService,
  private security:SecurityService
) { this.titleservice.setTitle('Lesson');}

ngOnInit(): void {
  this.storageCourse=JSON.parse(sessionStorage['Course']);
  this.storageLesson=JSON.parse(sessionStorage['Lesson']);
  this.GetLesson();

}

GetLesson(){
this.serviceL.MaintainLesson(this.storageLesson.LessonID).subscribe((result)=>{
this.lesson=result as Lesson;
this.gettingLesson=false;
})
}

validateFormControls(): boolean {
  if (
   
        this.nameFormControl.hasError('required')  == false &&
        this.descFormControl.hasError('required') == false &&
        this.videoFormControl.hasError('required') == false && 
        this.videoFormControl.hasError('pattern') == false
  )
  {return false}
  else{return true}
}



onBack()
{
  this.router.navigate(['admin/view-lesson']);
}



onSubmit() {
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
  } 
  else 
  {
  const title = 'Confirm Edit Lesson';
  const message = 'Are you sure you want to edit the Lesson?';
  this.showDialog(title, message);
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
    height: '30vh',
  });

  dialogReference.afterClosed().subscribe((result) => {
    if (result == true) 
    {
      this.isLoading=true;
      this.serviceL.UpdateLesson(this.lesson.LessonID,this.lesson).subscribe((result:any)=>
      {
        if(result.Status===200)
        {
          this.snack.open(
            'Lesson updated successfully!',
                  'OK',
                  {
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                    duration: 3000,
                  }
          );
          this.isLoading=false;
          sessionStorage.removeItem('Lesson');
          sessionStorage['Lesson'] = JSON.stringify(this.lesson);
          this.router.navigate(['admin/view-lesson']);

          let audit = new AuditLog();
          audit.AuditLogID = 0;
          audit.UserID = this.security.User.UserID;
          audit.AuditName = 'Update Lesson';
          audit.Description = 'Employee, ' + this.security.User.Username + ', updated the Lesson: ' + this.lesson.LessonName + ', in the course: ' + this.storageCourse.Name
          audit.Date = '';

          this.aService.AddAudit(audit).subscribe((data) => {
            //console.log(data);
            //this.refreshForm();
          })
        }
        
        else if(result.Status===100)
        {
          this.isLoading=false;
          const dialogReference = this.dialog.open(
            ExistsDialogComponent,
            {
              data: {
                dialogTitle: 'Video Duplication',
                dialogMessage: 'Video belongs to another lesson in this course. Please enter a different Video ID',
                operation: 'ok',
              },
              width: '50vw',
              height:'30vh'
            }
          );
        }
        else if(result.Status===400)
        {
          this.isLoading=false;
          const dialogReference = this.dialog.open(
            ExistsDialogComponent,
            {
              data: {
                dialogTitle: 'Error',
                dialogMessage: 'Invalid data, ensure data is in the correct format',
                operation: 'ok',
              },
              width: '50vw',
              height: '30vh',
            }
          );
        }
        else if(result.Status===404)
        {
          this.isLoading=false;
          const dialogReference = this.dialog.open(
            ExistsDialogComponent,
            {
              data: {
                dialogTitle: 'Lesson exists under section',
                dialogMessage: 'Enter new lesson name',
                operation: 'ok',
              },
              width: '50vw',
              height: '30vh',
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
                dialogMessage: 'Internal server error, please try again',
                operation: 'ok',
              },
              width: '50vw',
              height: '30vh',
            }
          );
        }
      })
    }
  });
}

}
