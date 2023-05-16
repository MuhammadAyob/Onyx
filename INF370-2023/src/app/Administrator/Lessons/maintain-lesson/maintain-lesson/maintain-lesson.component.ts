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

nameFormControl = new FormControl('', [Validators.required]);
descFormControl = new FormControl('', [Validators.required]);
videoFormControl = new FormControl('', [Validators.required,]);

constructor(
  public router: Router,
  private location: Location,
  private dialog: MatDialog,
  private serviceL: LessonService,
  private snack:MatSnackBar,
  public toastr: ToastrService,
  private titleservice: Title
) { this.titleservice.setTitle('Lesson');}

ngOnInit(): void {
  this.storageCourse=JSON.parse(sessionStorage['Course']);
  this.storageLesson=JSON.parse(sessionStorage['Lesson']);
  this.storageSection=JSON.parse(sessionStorage['Section']);
  this.GetLesson();
  console.log(this.lesson)

}

GetLesson(){
this.serviceL.MaintainLesson(this.storageLesson.LessonID).subscribe((result)=>{
this.lesson=result as Lesson;
console.log(result);
})
}

validateFormControls(): boolean {
  if (
    this.descFormControl.hasError('required') == false &&
        this.nameFormControl.hasError('required')  == false &&
        this.descFormControl.hasError('required') == false &&
        this.videoFormControl.hasError('required') == false 
  )
  {return false}
  else{return true}
}



onBack()
{
  this.router.navigate(['admin/view-lesson']);
}

onArrowBack()
{
  this.location.back();
}

onSubmit() {
  const isInvalid = this.validateFormControls();
  if (isInvalid == true) {
    this.dialog.open(InputDialogComponent, {
      data: {
        dialogTitle: "Input Error",
        dialogMessage: "Correct Errors"
      },
      width: '25vw',
      height: '27vh',
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
    width: '25vw',
  });

  dialogReference.afterClosed().subscribe((result) => {
    if (result == true) 
    {
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
          this.router.navigate(['admin/view-section']);
        }
        else if(result.Status===400)
        {
          const dialogReference = this.dialog.open(
            ExistsDialogComponent,
            {
              data: {
                dialogTitle: 'Error',
                dialogMessage: 'Invalid data, ensure data is in the correct format',
                operation: 'ok',
              },
              width: '25vw',
            }
          );
        }
        else if(result.Status===404)
        {
          const dialogReference = this.dialog.open(
            ExistsDialogComponent,
            {
              data: {
                dialogTitle: 'Lesson exists under section',
                dialogMessage: 'Enter new lesson name',
                operation: 'ok',
              },
              width: '25vw',
            }
          );
        }
        else
        {
          const dialogReference = this.dialog.open(
            ExistsDialogComponent,
            {
              data: {
                dialogTitle: 'Error',
                dialogMessage: 'Internal server error, please try again',
                operation: 'ok',
              },
              width: '25vw',
            }
          );
        }
      })
    }
  });
}

}
