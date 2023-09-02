import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { MaintenanceType } from 'src/app/Models/maintenance-type.model';
import { MaintenanceTypeService } from 'src/app/Services/maintenance-type.service';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuditLog } from 'src/app/Models/audit.model';
import { AuditLogService } from 'src/app/Services/audit-log.service';
import { SecurityService } from 'src/app/Services/security.service';

export interface DialogData {
  dialogMessage: string;
}

@Component({
  selector: 'app-add-maintenance-type',
  templateUrl: './add-maintenance-type.component.html',
  styleUrls: ['./add-maintenance-type.component.scss']
})
export class AddMaintenanceTypeComponent implements OnInit {
nameFormControl = new FormControl('', [Validators.required]);
type!:MaintenanceType;
isLoading:boolean=false;

constructor(
  public router: Router,
    private location: Location,
    private dialog: MatDialog,
    private service: MaintenanceTypeService,
    public toastr: ToastrService,
    private _snack:MatSnackBar,
    private titleservice: Title,
    private aService:AuditLogService,
    private security:SecurityService) 
  { this.titleservice.setTitle('Maintenance Type');}



  ngOnInit(): void {
    this.refreshForm();
  }

  refreshForm() {
    this.type = {
      MaintenanceTypeID: 0,
      Type: ''
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
      const title = 'Confirm New Type';
      const message = 'Are you sure you want to add the new Type?';
      this.showDialog(title, message);
    }
  }

  validateFormControls(): boolean {
    if (
      this.nameFormControl.hasError('required') == false
    )
    {return false}
    else
    {return true}
  }

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
        departmentData: this.type,
      }, //^captured department info here for validation
      height: '30vh',
      width: '50vw',
    });

    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        this.isLoading=true;
        this.service.AddType(this.type).subscribe(
          (result:any) => {
            console.log(result);
            if(result.Status===200)
            {
              this.isLoading=false;
              this._snack.open(
                'Maintenance Type added successfully!',
                      'OK',
                      {
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        duration: 3000,
                      }
              );
              this.router.navigate(['admin/read-maintenance-types']);
              let audit = new AuditLog();
              audit.AuditLogID = 0;
              audit.UserID = this.security.User.UserID;
              audit.AuditName = 'Add Maintenance Type';
              audit.Description = 'Employee, ' + this.security.User.Username + ', added a new Maintenance Type: ' + this.type.Type
              audit.Date = '';
  
              this.aService.AddAudit(audit).subscribe((data) => {
                //console.log(data);
                //this.refreshForm();
              })
            }

            else if(result.Status===404)
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

            else if(result.Status===400)
            {
              this.isLoading=false;
              const dialogReference = this.dialog.open(
                ExistsDialogComponent,
                {
                  data: {
                    dialogTitle: 'Error',
                    dialogMessage: 'Maintenance Type exists, please enter a different Maintenance Type.',
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
                    dialogMessage: 'Can not establish connection. Please try again',
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
