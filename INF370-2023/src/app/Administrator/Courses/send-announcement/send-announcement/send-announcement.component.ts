import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CourseService } from 'src/app/Services/course.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { Location } from '@angular/common';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { Announcement } from 'src/app/Models/announcement.model';

@Component({
  selector: 'app-send-announcement',
  templateUrl: './send-announcement.component.html',
  styleUrls: ['./send-announcement.component.scss']
})

export class SendAnnouncementComponent implements OnInit {
messageFormControl = new FormControl('', [Validators.required]);

Course:any;
CourseID:any;
message!:'';
announcement!:Announcement;

constructor( 
  public router: Router,
  private location: Location,
  private titleservice: Title,
  private dialog: MatDialog,
  public toastr: ToastrService,
  private service: CourseService,
  private snack:MatSnackBar) 
  { this.titleservice.setTitle('Courses'); }

  ngOnInit(): void {
  this.refreshForm();
  this.Course = JSON.parse(sessionStorage['Course']);
  this.announcement.CourseID = this.Course.CourseID;
  }

  refreshForm() {
    this.announcement = {
      CourseID: 0,
      Message: ''
    };
  }
  onBack() {
    this.router.navigate(['admin/read-courses']);
  }

  showDialog(title: string, message: string): void {
    const dialogReference = this.dialog.open(ConfirmDialogComponent, {
      data: {
        dialogTitle: title,
        dialogMessage: message,
        operation: 'add',
        departmentData: this.CourseID,
      }, //^captured department info here for validation
      height: '30vh',
      width: '50vw',
    });

    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        this.service.SendAnnouncement(this.announcement).subscribe(
          (result:any) => {
            console.log(result);
            if(result.Status===200)
            {
              this.snack.open(
                'Announcement sent successfully!',
                      'OK',
                      {
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        duration: 3000,
                      }
              );
              this.router.navigate(['admin/read-courses']);
            }

            else if(result.Status===404)
            {
              const dialogReference = this.dialog.open(
                ExistsDialogComponent,
                {
                  data: {
                    dialogTitle: 'Cannot send announcement',
                    dialogMessage: 'No students are enrolled in this course!',
                    operation: 'ok',
                  },
                  width: '50vw',
                  height:'30vh'
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
                    dialogMessage: 'Can not establish connection. Please try again',
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

  onSubmit() {
    console.log(this.announcement);
    const isInvalid = this.validateFormControls();
    if (isInvalid == true) {
      this.dialog.open(InputDialogComponent, {
        data: {
          dialogTitle: "Input Error",
          dialogMessage: "Correct Errors"
        },
        width: '50vw',
        height: '30vh',
      });
    } else {
      const title = 'Confirm Announcement';
      const message = 'Are you sure you want to send the announcement?';
      this.showDialog(title, message);
    }
  }

  validateFormControls(): boolean {
    if (
      this.messageFormControl.hasError('required') == false 
    )
    {return false}
    else
    {return true}
  }

}


