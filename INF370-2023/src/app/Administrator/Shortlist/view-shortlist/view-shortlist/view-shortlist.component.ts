import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { Shortlist } from 'src/app/Models/shortlist.model';
import { ShortlistService } from 'src/app/Services/shortlist.service';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-view-shortlist',
  templateUrl: './view-shortlist.component.html',
  styleUrls: ['./view-shortlist.component.scss']
})

export class ViewShortlistComponent implements OnInit {

  shortlist!: Shortlist;
  id: any;
  pdfSrc:any;
  dataImage:any;

  isLoading!:boolean;

  constructor(
    public router: Router,
    private location: Location,
    private titleservice: Title,
    private service: ShortlistService,
    private snack: MatSnackBar,
    public toaster: ToastrService,
    private dialog: MatDialog, 
    private sanitizer: DomSanitizer) 
    { this.titleservice.setTitle('Shortlisted Applicant');}

  ngOnInit(): void {
    this.shortlist= JSON.parse(sessionStorage['shortlist']);
    this.id = this.shortlist.ApplicationID;
    this.dataImage = this.shortlist.Image;
    this.pdfSrc = 'data:image/pdf;base64,' + this.shortlist.CV;
  
   
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

    saveAs(blob, 'ShortlistCV.pdf');
  }

  onBack() {
    this.location.back();
  }

  onReject() {
    const title = 'Confirm Rejection of Applicant';
    const message = 'Are you sure you want to reject the selected shortlisted Applicant?';
    this.showRejectDialog(title, message);
  }

  onAccept() {
    if(this.shortlist.ApplicationStatus == "Shortlisted")
    {
      const dialogReference = this.dialog.open(ExistsDialogComponent, {
        data: {
          dialogTitle: 'Error',
          dialogMessage: 'Applicant needs to be offered employment before being accepted',
          operation: 'ok',
        },
        width: '50vw',
        height:'30vh'
      });
    }

    else if(this.shortlist.ApplicationStatus == "Interviewee")
    {
      const dialogReference = this.dialog.open(ExistsDialogComponent, {
        data: {
          dialogTitle: 'Error',
          dialogMessage: 'Applicant needs to be offered employment before being accepted',
          operation: 'ok',
        },
        width: '50vw',
        height:'30vh'
      });
    }
    else{
      this.router.navigate(['admin/accept-applicant']);
    }
    
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
        this.isLoading  = true;
        this.service.RejectShortlistedCandidate(this.id).subscribe(
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
              this.isLoading  = false;
              this.router.navigate(['admin/read-shortlist']);
            }
            else if(result.Status === 400)
            {
              this.isLoading  = false;
              const dialogReference = this.dialog.open(ExistsDialogComponent, {
                data: {
                  dialogTitle: 'Error',
                  dialogMessage: 'Applicant has an unattended interview slot. Ensure attendance has been taken or remove the slot first before proceeding',
                  operation: 'ok',
                },
                width: '50vw',
                height:'30vh'
              });
            }
            else
            {
              this.isLoading  = false;
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
