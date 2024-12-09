import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateRequest } from 'src/app/Models/update-request.model';
import { UpdateRequestService } from 'src/app/Services/update-request.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Toast, ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-request-update',
  templateUrl: './request-update.component.html',
  styleUrls: ['./request-update.component.scss']
})
export class RequestUpdateComponent implements OnInit {
  nameFormControl = new FormControl('', [Validators.required]);
  descFormControl = new FormControl('', [Validators.required]);
  imgFormControl = new FormControl('', [Validators.required]);

  updateRequest!: UpdateRequest;
  updateFile: string = '';
  fileAttr = ' ';

  constructor( 
    public router: Router,
    private location: Location,
    private toastr: ToastrService,
    private service: UpdateRequestService,
    private snack: MatSnackBar,
    private titleservice: Title,
    private dialog: MatDialog) 
    { this.titleservice.setTitle('Skill/Qualification Update');}

  ngOnInit(): void {
    this.refreshObject();
  }

  refreshObject() {
    this.updateRequest = {
      UpdateDescription: '',
      UpdateSubject: '',
      UpdateRequestStatusID: 1,
      EmployeeID: 0,
      UpdateRequestID: 0,
      Proof: '',
    };
  }

  onBack() {
    this.location.back();
  }

  uploadFileEvt(dataFile:any) {
    this.fileAttr = '';
    Array.from(dataFile.target.files as FileList).forEach((file: File) => {
      this.fileAttr += file.name + ' - ';
    });

    var fileUpload = dataFile.target.files[0];
    var fileReader = new FileReader();
    fileReader.readAsDataURL(fileUpload);
    fileReader.onloadend = () => {
      this.updateFile = fileReader.result!.toString();
    };
  }

  validateFormControls(): boolean {
    if (
      this.descFormControl.hasError('required') == false &&
      this.nameFormControl.hasError('required') == false &&
      this.imgFormControl.hasError('required') == false
    ) {
      return false;
    } else {
      return true;
    }
  }

  onSubmit() {
    const isInvalid = this.validateFormControls();
    if (isInvalid == true) {
      this.dialog.open(InputDialogComponent, {
        data: {
          dialogTitle: 'Input Error',
          dialogMessage: 'Correct Errors',
        },
        width: '25vw',
        height: '27vh',
      });
    } else {
      const dialogReference = this.dialog.open(ConfirmDialogComponent, {
        data: {
          dialogTitle: 'Confirm Update Request',
          dialogMessage: 'Are you sure you want to request an update?',
        },
        width: '25vw',
      });

      dialogReference.afterClosed().subscribe((result) => {
        if(result == true)
        {
        this.updateFile = this.updateFile.slice(28);
        this.updateRequest.EmployeeID = sessionStorage.getItem('EmployeeID');
        this.updateRequest.UpdateRequestID = 0;
        this.updateRequest.Proof = this.updateFile;
        this.updateRequest.UpdateRequestStatusID = 1;

        this.service.AddUpdateRequest(this.updateRequest).subscribe((result:any) => {
           console.log(result);
           if(result.Status === 200)
           {
            this.snack.open(
              'Request posted successfully!',
                    'OK',
                    {
                      horizontalPosition: 'center',
                      verticalPosition: 'bottom',
                      duration: 5000,
                    }
            );
            this.router.navigate(['home/employee-home']);
           }
           else if(result.Status === 404)
           {
            this.dialog.open(ExistsDialogComponent, {
              data: {
                dialogTitle: 'Error',
                dialogMessage:
                  'Invalid data entry, please try again',
                operation: 'ok',
              },
              width: '25vw',
            });
           }
           else{
            this.dialog.open(ExistsDialogComponent, {
              data: {
                dialogTitle: 'Error',
                dialogMessage:
                  'Internal server error. Please try again',
                operation: 'ok',
              },
              width: '25vw',
            });
           }
          }
        );
        }
      });
    }
  }

  onArrowBack() {
    this.location.back();
  }

}
