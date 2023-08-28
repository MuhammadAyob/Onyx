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
import { AuditLogService } from 'src/app/Services/audit-log.service';
import { AuditLog } from 'src/app/Models/audit.model';
import { SecurityService } from 'src/app/Services/security.service';

@Component({
  selector: 'app-maintain-job',
  templateUrl: './maintain-job.component.html',
  styleUrls: ['./maintain-job.component.scss'],
  providers: [DatePipe]
})
export class MaintainJobComponent implements OnInit {

titleFormControl = new FormControl('', [Validators.required]);

descFormControl = new FormControl('', [Validators.required]);

requirementsFormControl = new FormControl('', [Validators.required]);

deadlineFormControl = new FormControl('', [Validators.required]);

workTypeFormControl = new FormControl('', [Validators.required]);

//JobOpportunity!:JobOpportunity;

isLoading!:boolean;

test:any;
todayDate:any;
testDate:any;

isChecked:any;

 WorkTypeList!:WorkType[];

 constructor(public router: Router,
    private location: Location,
    private titleservice: Title,
    private dialog: MatDialog,
    private service: JobOppService,
    public toaster: ToastrService,
    private datePipe: DatePipe,
    private snack:MatSnackBar,
    private aService:AuditLogService,
    private security:SecurityService) 
    { this.titleservice.setTitle('Job Opportunity');}

  ngOnInit(): void {
    this.test = JSON.parse(sessionStorage['jobOpportunity']);
    this.getTypes();

  }

  getTypes(){
    this.service.GetWorkTypes().subscribe((result)=>{
    this.WorkTypeList = result as WorkType[]; 
   

     })
    }



validateDate() {
  return false;
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
          dialogMessage: 'Please select a date later than or equal to ' + this.testDate +', if the job is still enabled. ',
        },
        width: '50vw',
        height: '30vh',
      });
    }
   
    else {
      const title = 'Confirm Edit Job Opportunity';
      const message = 'Are you sure you want to edit the Job Opportunity?';
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
     // jobOppData: this.JobOpportunity,
    },
    width: '50vw',
    height:'30vh'
  });
  // console.log(this.JobOpportunity)

  dialogReference.afterClosed().subscribe((result) => {
    if (result == true) {
      this.isLoading=true;
      let job = new JobOpportunity();
      job.JobOppID = this.test.JobOppID;
      job.JobOppTitle = this.test.JobOppTitle;
      job.JobOppDescription = this.test.JobOppDescription;
      job.JobOppRequirements=this.test.JobOppRequirements;

     

      job.JobOppDeadline = this.datePipe.transform(this.test.JobOppDeadline, 'yyyy/MM/dd');
  
      job.JobOppStatusID = this.test.JobOppStatusID;
      job.WorkTypeID=this.test.WorkTypeID;
      this.service.UpdateJob(job.JobOppID, job).subscribe(
        (result:any) => {
         console.log(result);
         if(result.Status === 200)
        {
          this.snack.open(
            'Job Opportunity updated successfully!',
                  'OK',
                  {
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                    duration: 3000,
                  }
          );
           this.isLoading=false;
           this.router.navigate(['admin/read-jobs']);

           // Audit Log 

           let audit = new AuditLog();
           audit.AuditLogID = 0;
           audit.UserID = this.security.User.UserID;
           audit.AuditName = 'Update Job Opportunity';
           audit.Description = 'Employee, ' + this.security.User.Username + ', updated the Job Opportunity: ' + job.JobOppTitle
           audit.Date = '';

           this.aService.AddAudit(audit).subscribe((data) => {
             //console.log(data);
             //this.refreshForm();
           })
        }
        else if(result.Status === 400)
        {
          this.isLoading=false;
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
          this.isLoading=false;
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
        else if(result.Status === 600)
        {
          this.isLoading=false;
          const dialogReference = this.dialog.open(
            ExistsDialogComponent,
            {
              data: {
                dialogTitle: 'Error',
                dialogMessage: 'Deadline cannot be set prior to yesterday',
                operation: 'ok',
              },
              width: '50vw',
              height:'30vh'
            }
          );
        }
        else if(result.Status === 601 )
        {
          this.isLoading=false;
          const dialogReference = this.dialog.open(
            ExistsDialogComponent,
            {
              data: {
                dialogTitle: 'Error',
                dialogMessage: 'You cannot change an expired job opportunities deadline to a date that has passed',
                operation: 'ok',
              },
              width: '50vw',
              height:'30vh'
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

onBack() {
  this.location.back();
}

}
