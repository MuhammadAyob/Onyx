import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location, Time } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ScanDialogComponent } from 'src/app/Dialog/scan-dialog/scan-dialog/scan-dialog.component';
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
import { AddInterviewDialogComponent } from 'src/app/Dialog/add-new-interview-dialog/add-interview-dialog/add-interview-dialog.component';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-read-interview-slots',
  templateUrl: './read-interview-slots.component.html',
  styleUrls: ['./read-interview-slots.component.scss']
})
export class ReadInterviewSlotsComponent implements OnInit {
  displayedColumns: string[] = [
    'InterviewDate',
    'StartTime',
    'EndTime',
    'Name',
    'JobOpp',
    'DateAttended',
    'scan',
    'edit',
    'delete',
  ];

  public dataSource = new MatTableDataSource<any>();
isLoading:boolean=true;
  noData = this.dataSource.connect().pipe(map((data) => data.length === 0));

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  interviewSlotList!: InterviewSlots[];

  displayList!: string[];

  InterviewSlot!: InterviewSlots;

  currentDate = new Date();

  show: boolean = false;
  viewDate: Date = new Date();
  yesterday: Date = new Date();
  events: CalendarEvent[] = [];
  constructor(
    public router: Router,
    private location: Location,
    private titleservice: Title,
    private service: InterviewService,
    public toaster: ToastrService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { this.titleservice.setTitle('Interview Slots');
  this.yesterday.setDate(28);}

  ngOnInit(): void {
    this.refreshList();
    //this.populateCalendarInitially();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.refreshList();
    //this.populateCalendarInitially();
  }


  calender() {
    if (this.show == false) 
    {
    
    this.show = true;
    this.dataSource.data.forEach((interview) => {
      var add_minutes = function (dt:any, time:any) {
        var split = time.split(':');
        return new Date(
          dt.getTime() +
            split[0] * 60 * 60 * 1000 +
            split[1] * 60 * 1000 +
            split[2] * 1000
        );
      };
  
      this.events.push({
        start: add_minutes(
          new Date(interview.InterviewDate),
          interview.StartTime
        ),
        end: add_minutes(
          new Date(interview.InterviewDate),
          interview.EndTime
        ),
        title: interview.Name + ' ' + interview.Surname,
        color: colors.red,
      });
     // this.show = true;
    });
    } 
    else if (this.show == true) 
    {
      this.show = false;
      this.events=[];
    }
  }

  dayClicked(f:any){
 
    if(f.isPast === true){
      this.openPastDialog();
    }
    else{
      this.openAddInterviewDialog(f);
      console.log(f);
    }
  }

   isDateStringEqualToday(dateString: string): boolean {
    const targetDate = new Date(dateString);
    targetDate.setHours(0, 0, 0, 0); // Reset time components to zero
  
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time components to zero
  
    return targetDate.getTime() === today.getTime();
  }

  scanQRCode(obj:any){
   
    if(obj.Attended == "Yes")
    {
      const dialogReference = this.dialog.open(ExistsDialogComponent, {
        data: {
          dialogTitle: 'Oops',
          dialogMessage: 'This slot has already been scanned!',
          operation: 'ok',
        },
        width: '50vw',
        height:'40vh'
      });
    }
    else if(!this.isDateStringEqualToday(obj.InterviewDate))
    {
      const dialogReference = this.dialog.open(ExistsDialogComponent, {
        data: {
          dialogTitle: 'Oops',
          dialogMessage: 'You can only take attendance on the day of the interview date! If the date for the interview has been passed, please re-schedule this slot',
          operation: 'ok',
        },
        width: '50vw',
        height:'40vh'
      });
    }
    else
    {
      sessionStorage['slot'] = JSON.stringify(obj);
      const dialogReference = this.dialog.open(ScanDialogComponent,{
        data:this.refreshList(),
        width: '50vw',
        height:'70vh'
      })
    }
    
  }

  openPastDialog() {
    const dialogReference = this.dialog.open(ExistsDialogComponent, {
      data: {
        dialogTitle: 'Error :(',
        dialogMessage: 'The selected date has passed. If there were Interview Slots booked on this day their details can be viewed by simply clicking on the Red Event Icon',
        operation: 'ok',
      },
      width: '50vw',
      height:'40vh'
    });
  }

  openAddInterviewDialog(data:any){
    const dialogRef = this.dialog.open(AddInterviewDialogComponent, {
      data,
      height: '60vh',
      width: '53vw',
    });
  }

  activeDayIsOpen: boolean = true;
  view: CalendarView = CalendarView.Month;
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
  viewCalender(data:any) {
    const dialogReference = this.dialog.open(SlotInfoDialogComponent, {
      data,
      height: '42vh',
      width: '50vw',
    });
  }

  checkDate(date: Date): boolean {
    var testDate = new Date(date);
    if (testDate.getTime() > this.currentDate.getTime()) {
      return false;
    } else {
      return true;
    }
  }

  public doFilter = (event: Event) => {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
     if (this.dataSource.filteredData.length === 0) {

      const dialogReference = this.dialog.open(SearchDialogComponent, {

      });
      dialogReference.afterClosed().subscribe((result) => {
        if (result == true) {
         this.refreshList();
        }
      });
    }
  }

  refreshList() {
    this.service.GetSlots().subscribe((result) => {
      this.dataSource.data = result as any;
      this.isLoading=false;
    });
  }

  onEdit(obj:any) {
    sessionStorage['interviewSlot'] = JSON.stringify(obj);
    this.router.navigate(['admin/maintain-interview-slot']);
  }

  onDelete(obj:any) {
    console.log(obj)
    const title = 'Confirm Delete Interview Slot';
    const popupMessage = 'Interview Slot was deleted successfully';
    const message = 'Are you sure you want to delete the Interview Slot?';

    const dialogReference = this.dialog.open(ConfirmDialogComponent, {
      width: '50vw',
      height:'30vh',
      data: {
        dialogTitle: title,
        operation: 'delete',
        dialogMessage: message,
        dialogPopupMessage: popupMessage,
        skillData: obj,
      },
    });
    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {

      this.isLoading=true;
      //console.log(id);
      this.service.DeleteSlot(obj.InterviewSlotID).subscribe((res:any) => {
        console.log(res);
        if(res.Status === 200)
        {
          this.refreshList();
          this.isLoading=false;
         //this.ngOnInit();
          this._snackBar.open(
            'Interview Slot Deleted successfully!',
                  'OK',
                  {
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                    duration: 3000,
                  });
        }
        else
        {
          this.isLoading=false;
          this.dialog.open(
            InputDialogComponent,
            {
              height: '30vh',
              width: '50vw',
              data: {
                dialogTitle: "Error",
                dialogMessage: "Internal server error, please try again."
              },
            }
          );
        }
       
        //this.success();
      });
       
     
      }
    });
  }

  onView(obj:any) {
    sessionStorage['interviewSlot'] = JSON.stringify(obj);
    this.router.navigate(['admin/view-slot']);
  }

}

@Component({
  selector: 'Calender-Dialog-Component',
  templateUrl: 'CalenderDialog.html',
  providers: [DatePipe],
})

export class CalenderDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<CalenderDialogComponent>,
    private datePipe: DatePipe
  ) {}

  Ok(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'isPast',
  templateUrl: 'isPast.html',
  providers: [DatePipe],
})
export class IsPast {
  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<IsPast>,
  ) {}
}

@Component({
  selector: 'addInterviewSlot',
  templateUrl: 'addInterviewSlot.html',
  providers: [DatePipe],
})
export class AddInterviewSlotModal {
  startTimeFormControl = new FormControl('', [Validators.required]);
  endTimeFormControl = new FormControl('', [Validators.required]);
  intervieweeFormControl = new FormControl('', [Validators.required]);

  intervieweeList!: any[];
  filteredList!: any[];

  InterviewDetails!: InterviewDetails;

  transformedDate: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<AddInterviewSlotModal>,
    private datePipe: DatePipe,
    private service: InterviewService,
    public toastr: ToastrService,
    public router: Router,
    private snack:MatSnackBar
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
      Attended:'',
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
      this.startTimeFormControl.hasError('required') &&
      this.endTimeFormControl.hasError('required') &&
      this.intervieweeFormControl.hasError('required') 
    );
  }

  onSubmit(): void {
    console.log(this.InterviewDetails);
    const isInvalid = this.validateFormControls();
    if (isInvalid) {
      this.dialog.open(InputDialogComponent, {
        data: {
          dialogTitle: 'Input Error',
          dialogMessage: 'Correct Errors',
        },
        width: '50vw',
        height: '30vh',
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
        this.service.AddSlot(this.InterviewDetails).subscribe(
          (result:any) => {
            console.log(result);
            if(result.Status === 200)
            {
              //this.InterviewDetails = result as InterviewDetails;
              this.refreshForm();
  
              this.snack.open(
                'Interview Slot deleted successfully!',
                      'OK',
                      {
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        duration: 3000,
                      });
              window.location.reload();

            }
            else if(result.Status === 250){
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
