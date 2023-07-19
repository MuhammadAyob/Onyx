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
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-view-resource',
  templateUrl: './view-resource.component.html',
  styleUrls: ['./view-resource.component.scss']
})
export class ViewResourceComponent implements OnInit {

constructor(
private fb: FormBuilder,
public router: Router,
private location: Location,
private service: LessonResourceService,
private dialog: MatDialog,
public toaster: ToastrService,
private snack: MatSnackBar,
private titleservice: Title) 
{ this.titleservice.setTitle('Lesson Resource');}

storageResource:any;
resource:any;
pdfSrc:any;
isLoading:boolean=true;
ngOnInit(): void {
  this.storageResource=JSON.parse(sessionStorage['LessonResource']);
  this.getResource();

}

getResource(){
this.service.MaintainLessonResource(this.storageResource.ResourceID).subscribe((result)=>{
console.log(result);
this.resource = result as any;
this.pdfSrc = 'data:image/pdf;base64,' + this.resource.ResourceFile;
this.isLoading=false;
})
}

onBack()
{
  this.router.navigate(['admin/view-lesson']);
}

onEdit()
{
this.router.navigate(['admin/maintain-resource']);
}

onDelete() {
  const title = 'Confirm Delete Resource ';
  const message = 'Are you sure you want to delete the Resource?';
  
  const dialogReference = this.dialog.open(
    ConfirmDialogComponent,
      {
        width: '50vw',
        height:'30vh',
        data: {
          dialogTitle: title,
          operation: 'delete',
          dialogMessage: message,
        },
      }
    );
    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        this.service.DeleteLessonResource(this.resource.ResourceID).subscribe((res:any) => 
        {
          console.log(res);
          if(res.Status===200)
          {
            this.snack.open(
              'Resource deleted successfully!',
                    'OK',
                    {
                      horizontalPosition: 'center',
                      verticalPosition: 'bottom',
                      duration: 3000,
                    }
            );
            this.router.navigate(['admin/view-lesson']);
          }
          else
          {
            const dialogReference = this.dialog.open(
              ExistsDialogComponent,
              {
                data: {
                  dialogTitle: 'Error',
                  dialogMessage: 'Internal server error, please try again.',
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
