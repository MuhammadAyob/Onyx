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
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { AuditLogService } from 'src/app/Services/audit-log.service';
import { AuditLog } from 'src/app/Models/audit.model';
import { SecurityService } from 'src/app/Services/security.service';

@Component({
  selector: 'app-add-resource',
  templateUrl: './add-resource.component.html',
  styleUrls: ['./add-resource.component.scss']
})
export class AddResourceComponent implements OnInit {
resourceFormControl = new FormControl('', [Validators.required]);

isLoading!:boolean;
gettingResources:boolean=true;

constructor( 
private fb: FormBuilder,
public router: Router,
private location: Location,
private service: LessonResourceService,
private dialog: MatDialog,
public toaster: ToastrService,
private snack: MatSnackBar,
private titleservice: Title,
private aService:AuditLogService,
private security:SecurityService) 
{ this.titleservice.setTitle('Lesson Resource');}

test!: LessonResource;
resourceFile: string = "";
fileAttr = ' ';
storageLesson:any;
storageSection:any;
storageCourse:any;

ResourceDisplayedColumns: string[] = [
  'name',
];

public ResourceDataSource = new MatTableDataSource<any>();
noData = this.ResourceDataSource.connect().pipe(map((data) => data.length === 0));

@ViewChild(MatPaginator) paginator!: MatPaginator;

ngOnInit(): void {
  this.storageLesson=JSON.parse(sessionStorage['Lesson']);
  this.storageSection=JSON.parse(sessionStorage['Section']);
  this.storageCourse=JSON.parse(sessionStorage['Course']);
  this.refreshForm();
  this.refreshList();
}

refreshForm() {
  this.test = {
    ResourceID:0,
    LessonID:this.storageLesson.LessonID,
    ResourceName:'',
    ResourceFile:null
  };
}

ngAfterViewInit() {

  this.ResourceDataSource.paginator = this.paginator;
  this.refreshList();
}

refreshList() {
  this.service.GetLessonsResources(this.storageLesson.LessonID).subscribe((result) => {
  this.ResourceDataSource.data = result as any[];
  this.gettingResources=false;
  });
}

  public doFilter = (event:Event) => {
    this.ResourceDataSource.filter = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
     if (this.ResourceDataSource.filteredData.length === 0) {
  
      const dialogReference = this.dialog.open(SearchDialogComponent, {
  
      });
      dialogReference.afterClosed().subscribe((result) => {
        if (result == true) {
         this.refreshList();
        }
      });
    }
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
    const title = 'Confirm New Lesson Resource';
    const message = 'Are you sure you want to submit this File?';
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
  this.router.navigate(['admin/view-lesson']);
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
      this.service.AddLessonResource(this.test).subscribe((result:any)=>
      {
       
        if(result.Status===200)
        {
          this.snack.open(
            'Lesson resource added successfully!',
                  'OK',
                  {
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                    duration: 3000,
                  }
          );
          //this.refreshForm();
          this.isLoading=false;
          this.router.navigate(['admin/view-lesson']);

          let audit = new AuditLog();
          audit.AuditLogID = 0;
          audit.UserID = this.security.User.UserID;
          audit.AuditName = 'Add Lesson Resource';
          audit.Description = 'Employee, ' + this.security.User.Username + ', added a new Resource: ' + this.test.ResourceName  + ', to the lesson: ' + this.storageLesson.LessonName + ', under the section: ' + this.storageSection.SectionName + ', in the course: ' + this.storageCourse.Name
          audit.Date = '';

          this.aService.AddAudit(audit).subscribe((data) => {
            //console.log(data);
            this.refreshForm();
          })
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
