import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Qualification } from 'src/app/Models/qualification.model';
import { QualificationService } from 'src/app/Services/qualification.service';
import { ToastrService } from 'ngx-toastr';
import { AuditLogService } from 'src/app/Services/audit-log.service';
import { AuditLog } from 'src/app/Models/audit.model';
import { SecurityService } from 'src/app/Services/security.service';

@Component({
  selector: 'app-add-qualification',
  templateUrl: './add-qualification.component.html',
  styleUrls: ['./add-qualification.component.scss']
})
export class AddQualificationComponent implements OnInit {
  nameFormControl = new FormControl('', [Validators.required]);
  descFormControl = new FormControl('', [Validators.required]);

  qualification!:Qualification;
  isLoading:boolean=false;
  constructor(
    public router: Router,
    private location: Location,
    private dialog: MatDialog,
    private service: QualificationService,
    public toastr: ToastrService,
    private snack: MatSnackBar,
    private titleservice: Title,
    private aService:AuditLogService,
    private security:SecurityService
  ) { this.titleservice.setTitle('Qualification'); }

  ngOnInit(): void {
    this.refreshForm();
  }

  GetHelp(){
    localStorage.removeItem('pageNumber');
    localStorage.setItem('pageNumber', '51');
  }

  refreshForm() {
    this.qualification = {
      QualificationID: 0,
      QualificationName: '',
      Description: ''
    };
  }

  onSubmit() {
    const isInvalid = this.validateFormControls();
    if (isInvalid == true) {
      this.dialog.open(InputDialogComponent, {
        data: {
          dialogTitle: "Input Error",
          dialogMessage: "Correct errors on Highlighted fields"
        },
        width: '25vw',
        height: '27vh',
      });
    } else {
      const title = 'Confirm New qualification';
      const message = 'Are you sure you want to add the new qualification?';
      this.showDialog(title, message);
    }
  }

  validateFormControls(): boolean {
    if (
      this.descFormControl.hasError('required') == false &&
      this.nameFormControl.hasError('required') == false
    )
    {return false}
    else
    {return true}
  }
//
  onArrowBack(): void {
    this.location.back();
  }
  onBack() {
    this.location.back();
  }

  showDialog(title: string, message: string): void {
    const dialogReference = this.dialog.open(ConfirmDialogComponent, {
      data: {
        dialogTitle: title,
        dialogMessage: message,
        operation: 'add',
        qualificationData: this.qualification,
      }, //^captured department info here for validation
      height: '30vh',
      width: '50vw',
    });

    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        this.isLoading=true;
        this.service.AddQualification(this.qualification).subscribe(
          (result:any) => {
            if(result.Status===200)
            {
              this.snack.open(
                'Qualification added successfully!',
                      'OK',
                      {
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        duration: 3000,
                      }
              );
              //this.qualification = result as Qualification;
              //this.refreshForm();
              this.isLoading=false;
              this.router.navigate(['admin/read-qualification']);

              let audit = new AuditLog();
              audit.AuditLogID = 0;
              audit.UserID = this.security.User.UserID;
              audit.AuditName = 'Add Qualification';
              audit.Description = 'Employee, ' + this.security.User.Username + ', added a new Qualification: ' + this.qualification.QualificationName
              audit.Date = '';
  
              this.aService.AddAudit(audit).subscribe((data) => {
                //console.log(data);
                this.refreshForm();
              })
            }

            else if(result.Status===403)
            {
              this.isLoading=false;
              const dialogReference = this.dialog.open(
                ExistsDialogComponent,
                {
                  data: {
                    dialogTitle: 'Error',
                    dialogMessage: 'Invalid data post, please ensure data is in correct format',
                    operation: 'ok',
                  },
                  width: '50vw',
                  height:'30vh'
                }
              );
            }

            else if(result.Status===404)
            {
              this.isLoading=false;
              const dialogReference = this.dialog.open(
                ExistsDialogComponent,
                {
                  data: {
                    dialogTitle: 'Error',
                    dialogMessage: 'Qualification exists, please enter a different qualification',
                    operation: 'ok',
                  },
                  width: '50vw',
                  height:'30vh'
                }
              );
            }

            else
            {
              this.isLoading=false;
              const dialogReference = this.dialog.open(
                ExistsDialogComponent,
                {
                  data: {
                    dialogTitle: 'Error',
                    dialogMessage: 'Internal server error, please try again.',
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

}
