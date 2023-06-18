import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { JobOpportunities } from 'src/app/Models/JobOpportunities.model';
import { JobOpportunity } from 'src/app/Models/JobOpp.model';
import { JobOppService } from 'src/app/Services/job-opp.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';

@Component({
  selector: 'app-view-job',
  templateUrl: './view-job.component.html',
  styleUrls: ['./view-job.component.scss']
})
export class ViewJobComponent implements OnInit {
  test: any;
  constructor( public router: Router,
    private location: Location,
    private titleservice: Title,
    private service: JobOppService,
    private dialog: MatDialog,
    private toastr : ToastrService,
    private snack:MatSnackBar) 
    { this.titleservice.setTitle('Job Opportunity');}

  ngOnInit(): void {
    this.test = JSON.parse( sessionStorage['jobOpportunity']);
  }

  onBack() {
    this.location.back();
  }

  onEdit() {
    this.router.navigate(['admin/maintain-job']);
  }

  onDelete() {
    //this.id = this.test.JobOppID;

    const title = 'Confirm Disable Job Opportunity ';
    const popupMessage = 'Job Opportunity was disbaled successfully';
    const message = 'Are you sure you want to disable the Job Opportunity?';

    const dialogReference = this.dialog.open(
      ConfirmDialogComponent,
      {
        width: '50vw',
        height:'30vh',
        data: {
          dialogTitle: title,
          operation: 'delete',
          dialogMessage: message,
          dialogPopupMessage: popupMessage,
          //qualificationData: this.id,
        }, //^captured department info here.
      }
    );
    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        this.service.DeleteJob(this.test.JobOppID).subscribe((res:any) => {
          if(res.Status === 200)
          {
            this.snack.open(
              'Job Opportunity disabled successfully!',
                    'OK',
                    {
                      horizontalPosition: 'center',
                      verticalPosition: 'bottom',
                      duration: 3000,
                    });
            this.router.navigate(['admin/read-jobs']);       
          }
          else
          {
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
       
        });
      }
    });
  }

}
