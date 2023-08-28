import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { VERSION, ViewChild, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { InstructionalVideo } from 'src/app/Models/training-video.model';
import { InstructionalVideoService } from 'src/app/Services/instructional-video.service';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { AuditLog } from 'src/app/Models/audit.model';
import { AuditLogService } from 'src/app/Services/audit-log.service';
import { SecurityService } from 'src/app/Services/security.service';

export interface DialogData {
  dialogMessage: string;
}

@Component({
  selector: 'app-add-training-video',
  templateUrl: './add-training-video.component.html',
  styleUrls: ['./add-training-video.component.scss']
})
export class AddTrainingVideoComponent implements OnInit {
  nameFormControl = new FormControl('', [Validators.required]);
  descFormControl = new FormControl('', [Validators.required]);
  videoFormControl = new FormControl('', [Validators.required]);

  instructionalVideo!: InstructionalVideo;

  VideoLink!: string;
  id: any;

  constructor(
    public router:Router,
    public formbuilder: FormBuilder,
    private location: Location,
    private titleservice: Title,
    private dialog: MatDialog,
    private service: InstructionalVideoService,
    public toastr: ToastrService,
    private snack: MatSnackBar,
    private security:SecurityService,
    private aService:AuditLogService
  ) { this.titleservice.setTitle('Instructional Videos');}

  ngOnInit(): void {
    this.refreshForm();
  }

  refreshForm(){
    this.instructionalVideo = {
      VideoID: 0,
      VideoName: '',
      Description: '',
      VideoLink: ''
    };
  }
  
  onBack()
  {
    this.router.navigate(['admin/read-instructional-videos']);
  }
  
  validateFormControls(): boolean {
    if (
      this.descFormControl.hasError('required') == false &&
      this.nameFormControl.hasError('required') == false &&
      this.videoFormControl.hasError('required') == false
    ){return false}
    else
    {return true}
  }
  
  onArrowBack(){
    this.location.back();
  }

  onSubmit()
  {
    const isInvalid = this.validateFormControls();
    console.log(isInvalid);
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
      
      
      const title = 'Confirm New Instructional Video';
      const message = 'Are you sure you want to add the new instructional video?';
      this.showDialog(title, message);
    }
  }

  showDialog(title: string, message: string): void {
    const dialogReference = this.dialog.open(ConfirmDialogComponent, {
      data: {
        dialogTitle: title,
        dialogMessage: message,
        operation: 'add',
        departmentData: this.instructionalVideo,
      }, //^captured department info here for validation
      width: '50vw',
        height: '30vh',
    });

    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        this.service.AddInstructionalVideo(this.instructionalVideo).subscribe(
          (result:any) => {
            if(result.Status===200)
            {
              this.snack.open(
                'Video added successfully!',
                      'OK',
                      {
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        duration: 3000,
                      }
              );
                
                this.router.navigate(['admin/read-instructional-videos']);

                // Audit Log 

                let audit = new AuditLog();
                audit.AuditLogID = 0;
                audit.UserID = this.security.User.UserID;
                audit.AuditName = 'Add Instructional Video';
                audit.Description = 'Employee, ' + this.security.User.Username + ', added a new Instructional Video: ' + this.instructionalVideo.VideoName
                audit.Date = '';
    
                this.aService.AddAudit(audit).subscribe((data) => {
                  //console.log(data);
                  this.refreshForm();
                })
            }
            else if(result.Status===400)
            {
              const dialogReference = this.dialog.open(
                ExistsDialogComponent,
                {
                  data: {
                    dialogTitle: 'Error',
                    dialogMessage: 'Invalid data',
                    operation: 'ok',
                  },
                  width: '50vw',
                  height: '30vh',
                }
              );
            }
            else if(result.Status===404)
            {
              const dialogReference = this.dialog.open(
                ExistsDialogComponent,
                {
                  data: {
                    dialogTitle: 'Instructional Video Exists',
                    dialogMessage: 'Enter a new video name',
                    operation: 'ok',
                  },
                  width: '50vw',
                  height: '30vh',
                }
              );
            }
            else if(result.Status===600)
            {
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
                  width: '50vw',
                  height: '30vh',
                }
              );
            }
          }
        );
      }
    });
  }


}
