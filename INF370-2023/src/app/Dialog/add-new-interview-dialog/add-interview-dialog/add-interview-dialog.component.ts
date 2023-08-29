import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location, Time } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { SlotInfoDialogComponent } from 'src/app/Dialog/slot-info-dialog/slot-info-dialog/slot-info-dialog.component';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { map } from 'rxjs/operators';
import { InterviewDetails } from 'src/app/Models/InterviewDetails.model';
import { InterviewSlots } from 'src/app/Models/InterviewSlots.model';
import { Pending } from 'src/app/Models/Pending.model';
import { InterviewService } from 'src/app/Services/interview.service';
import { MatSort } from '@angular/material/sort';
import { CalendarEvent,CalendarView, } from 'angular-calendar';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuditLog } from 'src/app/Models/audit.model';
import { AuditLogService } from 'src/app/Services/audit-log.service';
import { SecurityService } from 'src/app/Services/security.service';

@Component({
  selector: 'app-add-interview-dialog',
  templateUrl: './add-interview-dialog.component.html',
  styleUrls: ['./add-interview-dialog.component.scss'],
  providers: [DatePipe]
})
export class AddInterviewDialogComponent implements OnInit {

  startTimeFormControl = new FormControl('', [Validators.required]);
  endTimeFormControl = new FormControl('', [Validators.required]);
  intervieweeFormControl = new FormControl('', [Validators.required]);

  intervieweeList!: any[];
  filteredList!: any[];

  InterviewDetails!: InterviewDetails;

  transformedDate: any;

  isLoading!:boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<AddInterviewDialogComponent>,
    private datePipe: DatePipe,
    private service: InterviewService,
    public toastr: ToastrService,
    public router: Router,
    private snack:MatSnackBar,
    private aService:AuditLogService,
    private security:SecurityService
  ) {}

  ngOnInit(){
    this.getIntervieweeDetails();
    this.refreshForm();
    this.transformDate();
  }

  transformDate(){
    this.transformedDate = this.datePipe.transform(this.data.date, 'yyyy-MM-dd');
    this.InterviewDetails.InterviewDate = this.transformedDate;
  }

  refreshForm() {
    this.InterviewDetails = {
      InterviewSlotID: 0,
      InterviewDate: new Date(),
      StartTime: '',
      EndTime:'',
      ApplicationID: 0,
      Attended:'No',
    DateAttended:null
     
    };
  }

  getIntervieweeDetails(){
    this.service.GetPending().subscribe(res => {
      this.intervieweeList = res as any;
    });
  }

  validateFormControls(): boolean {
    return (
      this.startTimeFormControl.hasError('required') ||
      this.endTimeFormControl.hasError('required') ||
      this.intervieweeFormControl.hasError('required') 
      );
  }

  onSubmit(): void {
    console.log(this.InterviewDetails);
    const isInvalid = this.validateFormControls();
    if (isInvalid == true) {
      this.dialog.open(InputDialogComponent, {
        data: {
          dialogTitle: 'Input Error',
          dialogMessage: 'Correct Errors on highlighted fields',
        },
        width: '25vw',
        height: '27vh',
      });
    }else {
      const title = 'Confirm New Interview Slot';
      const message = 'Are you sure you want to add the new Interview Slot?';
      this.showDialog(title, message);
    }
  }

  selectInterviewee($event:any){
    this.InterviewDetails.ApplicationID = $event.ApplicationID;
    
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
      if (result == true) {
        this.isLoading=true;
        this.service.AddSlot(this.InterviewDetails).subscribe(
          (result:any) => {
            console.log(result);
            if(result.Status === 200)
            {
              //this.InterviewDetails = result as InterviewDetails;
              let audit = new AuditLog();
              audit.AuditLogID = 0;
              audit.UserID = this.security.User.UserID;
              audit.AuditName = 'Add Interview Slot';
              audit.Description = 'Employee, ' + this.security.User.Username + ', added a new interview slot with details: ' + this.InterviewDetails.InterviewDate + ' ' + this.InterviewDetails.StartTime + ' - ' + this.InterviewDetails.EndTime
              audit.Date = '';
  
              this.aService.AddAudit(audit).subscribe((data) => {
                //console.log(data);
                //this.refreshForm();
              })
              this.refreshForm();
              this.isLoading=false;
              location.reload();
              this.snack.open(
                'Interview Slot added successfully!',
                      'OK',
                      {
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        duration: 3000,
                      });
                     


            }
            else if(result.Status === 250){
              this.isLoading=false;
              this.dialog.open(
                InputDialogComponent,
                {
                  height: '30vh',
                  width: '50vw',
                  data: {
                    dialogTitle: "Error",
                    dialogMessage: "The start time has already passed today "
                  },
                }
              );
            }
            else if(result.Status === 251){
              this.isLoading=false;
              this.dialog.open(
                InputDialogComponent,
                {
                  height: '30vh',
                  width: '50vw',
                  data: {
                    dialogTitle: "Error",
                    dialogMessage: "Ensure that start and end times make sense i.e the start time is not greater than the end time"
                  },
                }
              );
            }
            else if(result.Status === 300){
              this.isLoading=false;
              this.dialog.open(
                InputDialogComponent,
                {
                  height: '30vh',
                  width: '50vw',
                  data: {
                    dialogTitle: "Error",
                    dialogMessage: "Max slots per day has been reached. Please select another date"
                  },
                }
              );
            }
            else if(result.Status === 350){
              this.isLoading=false;
              this.dialog.open(
                InputDialogComponent,
                {
                  height: '30vh',
                  width: '50vw',
                  data: {
                    dialogTitle: "Overlap Error",
                    dialogMessage: "The slot overlaps/intersectswith another slot on the specified date. Please enter a different start and/or end time"
                  },
                }
              );
            }
            else if(result.Status === 404){
              this.isLoading=false;
              this.dialog.open(
                InputDialogComponent,
                {
                  height: '30vh',
                  width: '50vw',
                  data: {
                    dialogTitle: "Error",
                    dialogMessage: "Ensure data is in the correct format"
                  },
                }
              );
            }
            else{
              this.isLoading=false;
              this.dialog.open(
                InputDialogComponent,
                {
                  height: '30vh',
                  width: '50vw',
                  data: {
                    dialogTitle: "Error",
                    dialogMessage: "Internal server error. Please try again"
                  },
                }
              );
            }
           
          },
         
        );
      }
    });
  }

}
