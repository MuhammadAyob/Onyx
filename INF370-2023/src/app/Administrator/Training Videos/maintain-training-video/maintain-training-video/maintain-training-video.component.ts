import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { VERSION, ViewChild, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { InstructionalVideoService } from 'src/app/Services/instructional-video.service';
import { InstructionalVideo } from 'src/app/Models/training-video.model';
import { AuditLog } from 'src/app/Models/audit.model';
import { SecurityService } from 'src/app/Services/security.service';
import { AuditLogService } from 'src/app/Services/audit-log.service';

@Component({
  selector: 'app-maintain-training-video',
  templateUrl: './maintain-training-video.component.html',
  styleUrls: ['./maintain-training-video.component.scss']
})
export class MaintainTrainingVideoComponent implements OnInit {
  
  nameFormControl = new FormControl('', [Validators.required]);
  descFormControl = new FormControl('', [Validators.required]);
  videoFormControl = new FormControl('', [Validators.required]);


  instructionalVideo!: InstructionalVideo;
  instructionalVideoList!: InstructionalVideo[];
  isLoading:boolean=false;
  public dataSource = new MatTableDataSource<InstructionalVideo>();

   id : any;
 
   constructor(
    public router: Router,
    public formbuilder: FormBuilder,
    private location: Location,
    private titleservice: Title,
    public toastr: ToastrService,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private service: InstructionalVideoService,
    private aService:AuditLogService,
    private security:SecurityService
   ) { this.titleservice.setTitle('Videos');}

  ngOnInit(): void {
    this.instructionalVideo = JSON.parse( sessionStorage['instructionalVideo'] );
  }

  GetHelp(){
    localStorage.removeItem('pageNumber');
    localStorage.setItem('pageNumber', '14');
  }

  onBack() {
    this.location.back();
  }

  refreshList() {
    this.service.GetInstructionalVideos().subscribe((result) => {
      this.dataSource.data = result as InstructionalVideo[];
    });
  }

  onSubmit() {

    const isInvalid = this.validateFormControls();
    if (isInvalid == true) {
      this.dialog.open(InputDialogComponent, {
        data: {
          dialogTitle: "Input Error",
          dialogMessage: "Correct errors on Highlighted fields"
        },
        width: '27vw',
        height: '29vh',
      });
    } else {
      const title = 'Confirm Edit Video';
      const message = 'Are you sure you want to save changes to the video?';
      const popupMessage = 'Video changes successful!';
      this.showDialog(title, message, popupMessage);
    }
  }

  showDialog(title: string, message: string, popupMessage: string): void {
    const dialogReference = this.dialog.open(ConfirmDialogComponent, {
      data: {
        dialogTitle: title,
        dialogMessage: message,
        dialogPopupMessage: popupMessage,
        operation: 'add',
      },
      height: '30vh',
      width: '50vw',
    });

    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        this.isLoading=true;
        this.service
          .UpdateInstructionalVideo(this.instructionalVideo.VideoID, this.instructionalVideo)
          .subscribe(
            (result:any) => {
              if(result.Status===200)
              {
                this.snack.open(
                  'Video updated successfully!',
                        'OK',
                        {
                          horizontalPosition: 'center',
                          verticalPosition: 'bottom',
                          duration: 3000,
                        });
                       // this.instructionalVideo = result as InstructionalVideo;
                        this.refreshList();
                        this.isLoading=false;
                        this.router.navigate(['admin/read-instructional-videos']);

                         // Audit Log 

                let audit = new AuditLog();
                audit.AuditLogID = 0;
                audit.UserID = this.security.User.UserID;
                audit.AuditName = 'Update Instructional Video';
                audit.Description = 'Employee, ' + this.security.User.Username + ', updated the Instructional Video: ' + this.instructionalVideo.VideoName
                audit.Date = '';
    
                this.aService.AddAudit(audit).subscribe((data) => {
                  //console.log(data);
                 
                })
              }
              else if(result.Status===404)
              {
                this.isLoading=false;
                const dialogReference = this.dialog.open(
                  ExistsDialogComponent,
                  {
                    data: {
                      dialogTitle: 'Video Exists',
                      dialogMessage: 'Enter a different video name',
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
                      dialogMessage: 'Invalid data',
                      operation: 'ok',
                    },
                    width: '50vw',
                    height:'30vh'
                  }
                );
              }

              else if(result.Status===600)
              {
                this.isLoading=false;
                const dialogReference = this.dialog.open(
                  ExistsDialogComponent,
                  {
                    data: {
                      dialogTitle: 'Instructional Video Link Exists',
                      dialogMessage: 'Enter a new video link',
                      operation: 'ok',
                    },
                    width: '50vw',
                    height: '30vh',
                  }
                );
              }

              else{
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
            }
          );
      }
    });
  }

  validateFormControls(): boolean {
    if (
      this.nameFormControl.hasError('required') == false &&
      this.descFormControl.hasError('required') == false &&
      this.videoFormControl.hasError('required') == false &&
      this.videoFormControl.hasError('pattern') == false
    )
    {return false}
    else
    {return true}
  }

  onArrowBack() {
    this.location.back();
  }

}
