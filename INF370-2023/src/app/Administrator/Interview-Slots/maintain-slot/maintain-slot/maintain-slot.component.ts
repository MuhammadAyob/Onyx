import { InterviewService } from 'src/app/Services/interview.service';
import { InterviewDetails } from 'src/app/Models/InterviewDetails.model';
import { InterviewSlots } from 'src/app/Models/InterviewSlots.model';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-maintain-slot',
  templateUrl: './maintain-slot.component.html',
  styleUrls: ['./maintain-slot.component.scss'],
  providers: [DatePipe]
})
export class MaintainSlotComponent implements OnInit {
  dateFormControl = new FormControl('', [Validators.required]);
  startTimeFormControl = new FormControl('', [Validators.required]);
  endTimeFormControl = new FormControl('', [Validators.required]);
 
  interviewSlot: any;
  

  todayDate: any;
  transformedDate:any;
  isLoading = false;
  
  

  constructor(
    public router: Router,
    private location: Location,
    private titleservice: Title,
    private dialog: MatDialog,
    public toaster: ToastrService,
    private datePipe: DatePipe,
    private snack:MatSnackBar,
    private service: InterviewService) 
    { this.titleservice.setTitle('Interview Slot');}

  ngOnInit(): void {
    this.interviewSlot = JSON.parse(sessionStorage['interviewSlot']);
    //this.InterviewDetails.ApplicationID = this.interviewSlot.ApplicationID;
    //this.InterviewDetails.InterviewDate = this.interviewSlot.InterviewDate;
    //this.InterviewDetails.StartTime=this.interviewSlot.StartTime;
    //this.InterviewDetails.EndTime=this.interviewSlot.EndTime;
    //this.InterviewDetails.InterviewSlotID = this.interviewSlot.InterviewSlotID;
  }

  onBack() {
    this.router.navigate(['admin/read-interview-slots']);
  }

  onSubmit() {
   
    const isInvalidDate = this.validateDate();
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
    } else {
      if (isInvalidDate == true) {
        this.dialog.open(InputDialogComponent, {
          data: {
            dialogTitle: 'Invalid Date',
            dialogMessage: 'Please select a date later than or equal to ' +  this.todayDate,
          },
          width: '50vw',
          height: '30vh',
        });
      } else {
        const title = 'Confirm Edit Interview Slot';
        const message =
          'Are you sure you want to save changes to the interview slot?';
        const popupMessage = 'Interview Slot changes successful!';
        this.showDialog(title, message, popupMessage);
      }
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
      width: '50vw',
      height:'30vh'
    });

    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        this.isLoading=true;
        let interview = new InterviewDetails();
         interview.ApplicationID = this.interviewSlot.ApplicationID;
         interview.InterviewDate = this.interviewSlot.InterviewDate;
         interview.StartTime=this.interviewSlot.StartTime;
         interview.EndTime=this.interviewSlot.EndTime;
         interview.InterviewSlotID = this.interviewSlot.InterviewSlotID;
         interview.InterviewDate = this.datePipe.transform(this.interviewSlot.InterviewDate, 'yyyy/MM/dd');
         
        this.service
          .UpdateSlot(
            interview.InterviewSlotID,
            interview
          )
          .subscribe(
            (result:any) => {
              
              console.log(result);
              if(result.Status === 200)
              {
                this.snack.open(
                'Interview Slot updated successfully!',
                      'OK',
                      {
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        duration: 3000,
                      });
                this.isLoading=false;
                this.router.navigate(['admin/read-interview-slots']);
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
                      dialogMessage: "Ensure that start and end times make sense i.e the start time is not greater than or equal to the end time"
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

  validateFormControls(): boolean {
    if (
      this.dateFormControl.hasError('required') == false &&
      this.startTimeFormControl.hasError('required') == false &&
      this.endTimeFormControl.hasError('required') == false
    ) {
      return false;
    } else {
      return true;
    }
  }

  validateDate() {
    this.todayDate = new Date();
    this.todayDate = this.datePipe.transform(this.todayDate, 'yyyy/MM/dd');

    var blah :any;
    blah = this.datePipe.transform(this.interviewSlot.InterviewDate, 'yyyy/MM/dd');
    if (blah >= this.todayDate) {
      return false;
    } else {
      return true;
    }
  }

}
