import { SectionService } from 'src/app/Services/section.service';
import { CourseService } from 'src/app/Services/course.service';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { Section } from 'src/app/Models/section.model';

@Component({
  selector: 'app-maintain-section',
  templateUrl: './maintain-section.component.html',
  styleUrls: ['./maintain-section.component.scss']
})
export class MaintainSectionComponent implements OnInit {
nameFormControl = new FormControl('', [Validators.required]);
descFormControl = new FormControl('', [Validators.required]);

courseID!:number;
section!:Section;
storageCourse:any;
storageSection:any;

constructor(
  public router: Router,
  private location: Location,
  private titleservice: Title,
  private serviceS: SectionService,
  private service: CourseService,
  private dialog: MatDialog,
  private snack: MatSnackBar,
  private toastr: ToastrService
) { this.titleservice.setTitle('Section'); }


ngOnInit(): void {
  this.storageCourse=JSON.parse(sessionStorage['Course']);
  this.storageSection=JSON.parse(sessionStorage['Section']);
  this.courseID = this.storageCourse.CourseID;
  this.refreshForm();
  this.getSection();
}

getSection(){
  this.serviceS.MaintainSection(this.storageSection.SectionID).subscribe((res)=>{
    this.section=res as Section;
  })
}

refreshForm(){
  this.section = {
    SectionID:this.storageSection.SectionID,
    CourseID:this.courseID,
    SectionName:'',
    SectionDescription:''
  }
}

onBack()
{
  this.router.navigate(['admin/view-section']);
}

onArrowBack()
{
this.location.back();
}

validateFormControls(): boolean {
  if (
    this.descFormControl.hasError('required') == false &&
    this.nameFormControl.hasError('required')  == false 
    )
    { return false}
    else
    {return true}
}


onSubmit() {
  const isInvalid = this.validateFormControls();
  if (isInvalid == true) {
    this.dialog.open(InputDialogComponent, {
      data: {
        dialogTitle: 'Maintain error',
        dialogMessage: 'Correct errors',
        operation: 'ok',
      },
      width: '25vw',
      height: '27vh',
    });
  } else
  {
    const title = 'Confirm Update Phase';
    const message = 'Are you sure you want to update the phase?';
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
    if (result == true) {
      this.serviceS.UpdateSection(this.section.SectionID, this.section).subscribe((res:any) => 
      {
          if(res.Status===200)
          {
            this.snack.open(
              'Section updated successfully!',
                    'OK',
                    {
                      horizontalPosition: 'center',
                      verticalPosition: 'bottom',
                      duration: 3000,
                    }
            );
            this.router.navigate(['admin/view-section']);
          }
          else if(res.Status===404)
          {
            const dialogReference = this.dialog.open(
              ExistsDialogComponent,
              {
                data: {
                  dialogTitle: 'Section Name exists under course',
                  dialogMessage: 'Enter a different section name',
                  operation: 'ok',
                },
                width: '25vw',
              }
            );
          }
          else if(res.Status===400)
          {
            const dialogReference = this.dialog.open(
              ExistsDialogComponent,
              {
                data: {
                  dialogTitle: 'Invalid data',
                  dialogMessage: 'Please ensure the data is in the correct format',
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

      }
      );
    }
  });
}

}
