import { SecurityService } from 'src/app/Services/security.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component'; 
import { UpdateRequestService } from 'src/app/Services/update-request.service';
import { MatDialog } from '@angular/material/dialog';
import { convertCompilerOptionsFromJson } from 'typescript';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { saveAs } from 'file-saver';
import { AuditLogService } from 'src/app/Services/audit-log.service';
import { AuditLog } from 'src/app/Models/audit.model';

@Component({
  selector: 'app-maintain-update-request',
  templateUrl: './maintain-update-request.component.html',
  styleUrls: ['./maintain-update-request.component.scss']
})
export class MaintainUpdateRequestComponent implements OnInit {
  test: any;
  id!: number;
  request = {};
  pdfSrc = "";
  constructor( public router: Router,
    private location: Location,
    private service: UpdateRequestService,
    private dialog: MatDialog,
    private titleservice: Title,
    private security: SecurityService,
    private snack:MatSnackBar,
    private toastr: ToastrService,
    private aService:AuditLogService) 
    {this.titleservice.setTitle('Update Request'); }

  isLoading!:boolean;

  ngOnInit(): void {
    this.test = JSON.parse( sessionStorage['UpdateRequest'] );
    this.id = this.test.UpdateRequestID;
    this.pdfSrc = "data:image/pdf;base64," +  this.test.Proof;
  }

  onBack() {
    this.location.back();
  }

  onArrowBack() {
    this.location.back();
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

    saveAs(blob, 'Proof.pdf');
  }

  onAccept() {
    const title = 'Accept Update Request?';
    const popupMessage = 'Request accepted successfully';
    const message = 'Are you sure you want to mark the update request as approved?';

    const dialogReference = this.dialog.open(
      ConfirmDialogComponent,
      {
        height: '30vh',
        width: '50vw',
        data: {
          dialogTitle: title,
          operation: 'delete',
          dialogMessage: message,
          dialogPopupMessage: popupMessage,
          UpdateRequestData: this.id,
        }, //^captured department info here.
      }
    );
    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        this.isLoading=true;
        this.service.AcceptUpdateRequest(this.id).subscribe((res:any) => {
      
        if(res.Status === 200)
        {
          this.snack.open(
            'Request approved successfully! If you have not already done so, please attached the required skills and qualifications for the employee',
                  'OK',
                  {
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                    duration: 10000,
                  });
                  this.isLoading=false;
                  this.router.navigate(['admin/read-update-requests']);

                  // Audit

                  let audit = new AuditLog();
                  audit.AuditLogID = 0;
                  audit.UserID = this.security.User.UserID;
                  audit.AuditName = 'Finalize Technical Competency Update';
                  audit.Description = 'Employee, ' + this.security.User.Username + ', accepted Update Request: ' + this.test.UpdateSubject + ' of employee: ' + this.test.EmployeeName + ' ' + this.test.EmployeeSurname + ' - ' + this.test.RSAIDNumber
                  audit.Date = '';
      
                  this.aService.AddAudit(audit).subscribe((data) => {
                    //console.log(data);
                    //this.refreshForm();
                  })
        }
        else
        {
          this.isLoading=false;
          const dialogReference = this.dialog.open(
            ExistsDialogComponent,
            {
              data: {
                dialogTitle: 'Error',
                dialogMessage: 'Internal server error, failed to send sms',
                operation: 'ok',
              },
              height: '30vh',
              width: '50vw',
            }
          );
        } 

        });
      }
    });
  }

  onReject() {
    const title = 'Reject Update Request ';
    const message = 'Are you sure you want to mark the update request as rejected?';

    const dialogReference = this.dialog.open(
      ConfirmDialogComponent,
      {
        height: '30vh',
        width: '50vw',
        data: {
          dialogTitle: title,
          operation: 'delete',
          dialogMessage: message,
        },
      }
    );
    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        this.isLoading=true;
        this.service.RejectUpdateRequest(this.id).subscribe((res:any) => {
        console.log(res);
        if(res.Status === 200)
        {
          this.snack.open(
            'Request rejected successfully.',
                  'OK',
                  {
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                    duration: 5000,
                  });
                  this.isLoading=false;
                  this.router.navigate(['admin/read-update-requests']);

                   // Audit

                   let audit = new AuditLog();
                   audit.AuditLogID = 0;
                   audit.UserID = this.security.User.UserID;
                   audit.AuditName = 'Finalize Technical Competency Update';
                   audit.Description = 'Employee, ' + this.security.User.Username + ', rejected Update Request: ' + this.test.UpdateSubject + ' of employee: ' + this.test.EmployeeName + ' ' + this.test.EmployeeSurname + ' - ' + this.test.RSAIDNumber
                   audit.Date = '';
       
                   this.aService.AddAudit(audit).subscribe((data) => {
                     //console.log(data);
                     //this.refreshForm();
                   })
        }
        else
        {
          this.isLoading=false;
          const dialogReference = this.dialog.open(
            ExistsDialogComponent,
            {
              data: {
                dialogTitle: 'Error',
                dialogMessage: 'Internal server error, failed to send sms',
                operation: 'ok',
              },
              height: '30vh',
              width: '50vw',
            }
          );
        }

        });
      }
    });
  }

}
