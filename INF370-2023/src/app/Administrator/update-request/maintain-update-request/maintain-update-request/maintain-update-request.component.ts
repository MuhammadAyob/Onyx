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
    private toastr: ToastrService) 
    {this.titleservice.setTitle('Update Request'); }

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

  onAccept() {
    const title = 'Accept Update Skill ';
    const popupMessage = 'Request accepted successfully';
    const message = 'Are you sure you want to accept the update request?';

    const dialogReference = this.dialog.open(
      ConfirmDialogComponent,
      {
        height: '27vh',
        width: '25vw',
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
        this.service.AcceptUpdateRequest(this.id, this.test).subscribe((res:any) => {
        console.log(res);
        if(res.Status === 200)
        {
          this.snack.open(
            'Request approved successfully! If you have not already done so, please attached the required skills and qualifications for the employee',
                  'OK',
                  {
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                    duration: 1000,
                  });
                  this.router.navigate(['admin/read-update-requests']);
        }
        else
        {
          const dialogReference = this.dialog.open(
            ExistsDialogComponent,
            {
              data: {
                dialogTitle: 'Error',
                dialogMessage: 'Internal server error, please try again',
                operation: 'ok',
              },
              width: '25vw',
            }
          );
        } 

        });
      }
    });
  }

  onReject() {
    const title = 'Reject Update Skill ';
    const message = 'Are you sure you want to reject the update request?';

    const dialogReference = this.dialog.open(
      ConfirmDialogComponent,
      {
        height: '27vh',
        width: '25vw',
        data: {
          dialogTitle: title,
          operation: 'delete',
          dialogMessage: message,
        },
      }
    );
    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        console.log(this.id);
        this.service.RejectUpdateRequest(this.id, this.test).subscribe((res:any) => {
        console.log(res);
        if(res.Status === 200)
        {
          this.snack.open(
            'Request approved successfully!',
                  'OK',
                  {
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                    duration: 1000,
                  });
                  this.router.navigate(['admin/read-update-requests']);
        }
        else
        {
          const dialogReference = this.dialog.open(
            ExistsDialogComponent,
            {
              data: {
                dialogTitle: 'Error',
                dialogMessage: 'Internal server error, please try again',
                operation: 'ok',
              },
              width: '25vw',
            }
          );
        }

        });
      }
    });
  }

}
