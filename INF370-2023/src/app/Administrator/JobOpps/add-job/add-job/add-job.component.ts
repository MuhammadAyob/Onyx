import { JobOppService } from 'src/app/Services/job-opp.service';
import { JobOpportunity } from 'src/app/Models/JobOpp.model';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JobOppStatu } from 'src/app/Models/JobOppStatu.model';
import { WorkType } from 'src/app/Models/WorkType.model';

@Component({
  selector: 'app-add-job',
  templateUrl: './add-job.component.html',
  styleUrls: ['./add-job.component.scss'],
  providers: [DatePipe]
})

export class AddJobComponent implements OnInit {
  titleFormControl = new FormControl('', [Validators.required]);

  descFormControl = new FormControl('', [Validators.required]);

  requirementsFormControl = new FormControl('', [Validators.required]);

  deadlineFormControl = new FormControl('', [Validators.required]);

  workTypeFormControl = new FormControl('', [Validators.required]);

 JobOpportunity!:JobOpportunity;
 
 todayDate:any;

 isChecked:any;

 WorkTypeList!:WorkType[];

constructor(public router: Router,
  private location: Location,
  private titleservice: Title,
  private dialog: MatDialog,
  private service: JobOppService,
  public toaster: ToastrService,
  private datePipe: DatePipe,
  private snack:MatSnackBar) { this.titleservice.setTitle('Job Opportunity');}

  ngOnInit(): void {
    this.refreshForm();
    this.getTypes();
  }

  refreshForm(){
    this.JobOpportunity = {
      JobOppID:0,
      JobOppTitle:'',
      JobOppDescription:'',
      JobOppRequirements:'',
      JobOppDeadline:null,
      WorkTypeID:null,
      JobOppStatusID:1
    }
  }
  selectWorkType($event:any) {
    this.JobOpportunity.WorkTypeID = $event;
  }

getTypes(){
this.service.GetWorkTypes().subscribe((result)=>{
this.WorkTypeList = result as WorkType[]; 
 })
}

  validateDate() {
    this.todayDate = new Date();
    this.todayDate = this.datePipe.transform(this.todayDate, 'yyyy/MM/dd');
    var blah :any;

    blah = this.datePipe.transform(this.JobOpportunity.JobOppDeadline, 'yyyy/MM/dd');

    if (blah >= this.todayDate) {
      return false;
    } else {
      return true;
    }
  }
  validateFormControls(): boolean {
    if (
      this.descFormControl.hasError('required') == false &&
      this.deadlineFormControl.hasError('required') == false &&
      this.titleFormControl.hasError('required') == false &&
      this.requirementsFormControl.hasError('required') == false &&
      this.workTypeFormControl.hasError('required') == false 
      
    ) {
      return false;
    } else {
      return true;
    }
  }

  onSubmit() {
    console.log(this.JobOpportunity)
    const isInvalidDate = this.validateDate();
    const isInvalid = this.validateFormControls();
    if (isInvalid == true) {
      this.dialog.open(InputDialogComponent, {
        data: {
          dialogTitle: 'Input Error',
          dialogMessage: 'Correct Errors',
        },
        width: '50vw',
        height: '30vh',
      });
    } else {
      if (isInvalidDate == true) {
        this.dialog.open(InputDialogComponent, {
          data: {
            dialogTitle: 'Invalid Date',
            dialogMessage: 'Please select a date later than or equal to ' + this.todayDate,
          },
          width: '50vw',
          height: '30vh',
        });
      }
      else {
        const title = 'Confirm New Job Opportunity';
        const message = 'Are you sure you want to add the new Job Opportunity?';
        this.showDialog(title, message);
      }


    }
  }

  showDialog(title: string, message: string): void {
    const dialogReference = this.dialog.open(ConfirmDialogComponent, {
      data: {
        dialogTitle: title,
        dialogMessage: message,
        operation: 'add',
        jobOppData: this.JobOpportunity,
      },
      width: '50vw',
      height:'30vh'
    });
    console.log(this.JobOpportunity)

    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        var actualDate = new Date(this.JobOpportunity.JobOppDeadline);
        actualDate.setMinutes(
          actualDate.getMinutes() + 1440 + actualDate.getTimezoneOffset()
        );
        this.JobOpportunity.JobOppDeadline = actualDate;
        this.service.AddJob(this.JobOpportunity).subscribe(
          (result:any) => {
           console.log(result);
           if(result.Status === 200)
          {
            this.snack.open(
              'Job Opportunity added successfully!',
                    'OK',
                    {
                      horizontalPosition: 'center',
                      verticalPosition: 'bottom',
                      duration: 3000,
                    }
            );
             this.router.navigate(['admin/read-jobs']);
          }
          else if(result.Status === 400)
          {
            const dialogReference = this.dialog.open(
              ExistsDialogComponent,
              {
                data: {
                  dialogTitle: 'Error',
                  dialogMessage: 'Job Opportunity exists, please enter a different title.',
                  operation: 'ok',
                },
                width: '50vw',
                height:'30vh'
              }
            );
          }
          else if(result.Status === 404)
          {
            const dialogReference = this.dialog.open(
              ExistsDialogComponent,
              {
                data: {
                  dialogTitle: 'Error',
                  dialogMessage: 'Invalid data request, please ensure data body is valid',
                  operation: 'ok',
                },
                width: '50vw',
                height:'30vh'
              }
            );
          }
          else{
            const dialogReference = this.dialog.open(
              ExistsDialogComponent,
              {
                data: {
                  dialogTitle: 'Error',
                  dialogMessage: 'Internal server error. Please try again.',
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

  onArrowBack(): void {
    this.location.back();
  }

  onBack() {
    this.location.back();
  }
}
