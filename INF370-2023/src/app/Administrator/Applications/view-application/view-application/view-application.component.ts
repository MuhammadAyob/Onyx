import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { Application } from 'src/app/Models/application.model';
import { ApplicationsService } from 'src/app/Services/applications.service';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-view-application',
  templateUrl: './view-application.component.html',
  styleUrls: ['./view-application.component.scss']
})
export class ViewApplicationComponent implements OnInit {

  application!: Application;
  id: any;
  pdfSrc:any;
  dataImage:any;

  constructor(public router: Router,
    private location: Location,
    private titleservice: Title,
    private service: ApplicationsService,
    private snack: MatSnackBar,
    public toaster: ToastrService,
    private dialog: MatDialog, 
    private sanitizer: DomSanitizer) 
    { this.titleservice.setTitle('Applicant');}

  ngOnInit(): void {
    this.application= JSON.parse(sessionStorage['application']);
    this.id = this.application.ApplicationID;
    this.dataImage = this.application.Image;
    this.pdfSrc = 'data:image/pdf;base64,' + this.application.CV;
  
    console.log(this.id);
  }

  downloadPDF() {
    const pdfBase64 = this.pdfSrc.split(',')[1];
    const byteCharacters = atob(pdfBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    saveAs(blob, 'ApplicationCV.pdf');
  }
  onBack() {
    this.location.back();
  }

  onReject() {
    const title = 'Confirm Rejection of Applicant';
    const message = 'Are you sure you want to reject the selected Applicant?';
    this.showRejectDialog(title, message);
  }

  onShortlist() {
    const title = 'Confirm Shortlisting Applicant';
    const message =
      'Are you sure you want to shortlist the selected Applicant?';
    this.showDialog(title, message);
  }

  showRejectDialog(title: string, message: string): void {
    const dialogReference = this.dialog.open(ConfirmDialogComponent, {
      data: {
        dialogTitle: title,
        dialogMessage: message,
        operation: 'reject',
        intervieweeData: this.id,
      },
      width: '50vw',
      height:'30vh'
    });

    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        //this.isLoading  = true;
        this.service.RejectApplicant(this.id).subscribe(
          (result:any) => {
            if(result.Status === 200)
            {
              this.snack.open(
                'Applicant rejected!',
                      'OK',
                      {
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        duration: 3000,
                      }
              );
              this.router.navigate([
                'admin/read-applications',
              ]);
            }
            else
            {
              const dialogReference = this.dialog.open(ExistsDialogComponent, {
                data: {
                  dialogTitle: 'Error',
                  dialogMessage: 'Internal server error, please try again',
                  operation: 'ok',
                },
                width: '50vw',
                height:'30vh'
              });
            }
            
          }
        );
      }
    });
  }

  showDialog(title: string, message: string): void {
    const dialogReference = this.dialog.open(ConfirmDialogComponent, {
      data: {
        dialogTitle: title,
        dialogMessage: message,
        operation: 'add',
        intervieweeData: this.id,
      },
      width: '50vw',
      height:'30vh'
    });

    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        this.service.AddShortList(this.id).subscribe(
          (result:any) => {
            if(result.Status === 200)
            {
              this.snack.open(
                'Applicant added to Shortlist!',
                      'OK',
                      {
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        duration: 3000,
                      }
              );
              this.router.navigate(['admin/read-applications']);
            }
           else
           {
            const dialogReference = this.dialog.open(ExistsDialogComponent, {
              data: {
                dialogTitle: 'Error',
                dialogMessage: 'Internal server error, please try again',
                operation: 'ok',
              },
              width: '50vw',
              height:'30vh'
            });
           }
            
          }
        );
      }
    });
  }

}
