import { Component,VERSION,ElementRef, OnInit,ViewChild } from '@angular/core';
import {FormGroup, FormBuilder,Validators, FormControl} from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { Title } from '@angular/platform-browser';
import { LessonResource } from 'src/app/Models/LessonResource.model';
import { LessonResourceService } from 'src/app/Services/lesson-resource.service';

@Component({
  selector: 'app-maintain-resource',
  templateUrl: './maintain-resource.component.html',
  styleUrls: ['./maintain-resource.component.scss']
})
export class MaintainResourceComponent implements OnInit {
resourceFormControl = new FormControl('', [Validators.required]);

constructor(
private fb: FormBuilder,
public router: Router,
private location: Location,
private service: LessonResourceService,
private dialog: MatDialog,
public toaster: ToastrService,
private snack: MatSnackBar,
private titleservice: Title) { this.titleservice.setTitle('Lesson Resource');}

test!: LessonResource;
resourceFile: string = "";
fileAttr = ' ';
storageLessonResource:any;
isLoading!:boolean;
ngOnInit(): void {
  this.storageLessonResource=JSON.parse(sessionStorage['LessonResource']);
  this.refreshForm();
}

refreshForm() {
  this.test = {
    ResourceID:this.storageLessonResource.ResourceID,
    LessonID:this.storageLessonResource.LessonID,
    ResourceName:'',
    ResourceFile:null
  };
}

onSubmit() {
  this.resourceFile = this.resourceFile.slice(28);
  this.test.ResourceFile = this.resourceFile;
  console.log(this.test);

const isInvalid = this.validateFormControls();

  if (isInvalid == true) {
    this.dialog.open(InputDialogComponent, {
      data: {
        dialogTitle: "Input Error",
        dialogMessage: "Correct Errors on highlighted fields"
      },
      width: '25vw',
      height: '28vh',
    });
  } else {
    const title = 'Confirm Edit Resource';
    const message = 'Are you sure you want to edit this resource?';
    this.showDialog(title, message);
  }
}

validateFormControls(): boolean {
if (
  this.resourceFormControl.hasError('required') == false
  )
{return false}
else{return true}
}

onBack() {
  this.location.back();
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
    if (result == true) 
    {
      this.isLoading=true;
      this.service.UpdateLessonResource(this.test.ResourceID, this.test).subscribe((result:any)=>
      {
        console.log(result)
        if(result.Status===200)
        {
          this.isLoading=false;
          this.snack.open(
            'Lesson resource updated successfully!',
                  'OK',
                  {
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                    duration: 3000,
                  }
          );

          let obj = {LessonID:0, ResourceID:0, ResourceName:''};
          obj.LessonID = this.test.LessonID;
          obj.ResourceID = this.test.ResourceID;
          obj.ResourceName = this.test.ResourceName;
          sessionStorage.removeItem('LessonResource');
          sessionStorage['LessonResource'] = JSON.stringify(this.test);
          this.refreshForm();
          this.router.navigate(['admin/view-resource']);
        }
        else if(result.Status===100)
        {
          this.isLoading=false;
          const dialogReference = this.dialog.open(
            ExistsDialogComponent,
            {
              data: {
                dialogTitle: 'Error',
                dialogMessage: 'Resource File exists under this lesson. Please upload a different file',
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
              height:'30vh'
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
                dialogTitle: 'Lesson resource exists under this lesson',
                dialogMessage: 'Upload a different file',
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
                dialogMessage: 'Internal server error, please try again',
                operation: 'ok',
              },
              width: '50vw',
              height:'30vh'
            }
          );
        }
      })
    }
  });
}

uploadFileEvt(dataFile:any) 
  {
    this.fileAttr = '';
    Array.from(dataFile.target.files as FileList).forEach((file: File) => {
      this.fileAttr += file.name + ' - ';
    });

   this.test.ResourceName=this.fileAttr;
   var fileUpload = dataFile.target.files[0];
   var fileReader = new FileReader();
   fileReader.readAsDataURL(fileUpload);
     fileReader.onloadend = () => {
       this.resourceFile = fileReader.result!.toString();
     }
  }

}
