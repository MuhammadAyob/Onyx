import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { MaintenanceType } from 'src/app/Models/maintenance-type.model'; 
import { MaintenanceTypeService } from 'src/app/Services/maintenance-type.service'; 
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuditLog } from 'src/app/Models/audit.model';
import { AuditLogService } from 'src/app/Services/audit-log.service';
import { SecurityService } from 'src/app/Services/security.service';

@Component({
  selector: 'app-maintain-maintenance-type',
  templateUrl: './maintain-maintenance-type.component.html',
  styleUrls: ['./maintain-maintenance-type.component.scss']
})
export class MaintainMaintenanceTypeComponent implements OnInit {
nameFormControl = new FormControl('',[Validators.required]);

type!:MaintenanceType;
typelist!:MaintenanceType[];

public dataSource = new MatTableDataSource<MaintenanceType>();

constructor(
  public router:Router,
    private location:Location,
    private dialog:MatDialog,
    private service:MaintenanceTypeService,
    private titleservice:Title,
    public toastr: ToastrService,
    private snack:MatSnackBar,
    private aService:AuditLogService,
    private security:SecurityService
) {this.titleservice.setTitle('Maintenance Type'); }

  ngOnInit(): void {
    this.type=JSON.parse(sessionStorage['MaintenanceType'])
  }

  onBack(): void {
    this.location.back();
  }

  refreshList() {
    this.service.GetTypes().subscribe((result) => {
      this.dataSource.data = result as MaintenanceType[];
    });
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
      const title = 'Confirm Edit Type';
      const message = 'Are you sure you want to save changes to the Type?';
      const popupMessage = 'Type changes successful!';
      this.showDialog(title, message, popupMessage);
    }
  }

  showDialog(title: string, message: string, popupMessage: string): void {
    const dialogReference = this.dialog.open(ConfirmDialogComponent, {
      data: {
        dialogTitle: title,
        dialogMessage: message,
        dialogPopupMessage: popupMessage,
        operation: 'add',
        departmentData: this.type,
      }, //^captured department info here for validation
      height: '30vh',
      width: '50vw',
    });

    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        this.service
          .UpdateType(this.type.MaintenanceTypeID, this.type)
          .subscribe((result:any) => {
            if (result.Status === 200) 
            {
              this.snack.open(
                'Maintenance Type updated successfully!',
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
            audit.AuditName = 'Update Maintenance Type';
            audit.Description = 'Employee, ' + this.security.User.Username + ', updated the Maintenance Priority: ' + this.type.Type
            audit.Date = '';

        this.aService.AddAudit(audit).subscribe((data) => {
        })

            } 
            else if(result.Status===404)
            {
              const dialogReference = this.dialog.open(
                ExistsDialogComponent,
                {
                  data: {
                    dialogTitle: 'Error',
                    dialogMessage: 'Invalid data posted, please ensure correct data format',
                    operation: 'ok',
                  },
                  width: '50vw',
                  height:'30vh'
                }
              );
            }

            else if(result.Status===401)
            {
              const dialogReference = this.dialog.open(
                ExistsDialogComponent,
                {
                  data: {
                    dialogTitle: 'Error',
                    dialogMessage: 'Maintenance Type exists, please enter a different name',
                    operation: 'ok',
                  },
                  width: '50vw',
                  height:'30vh'
                }
              );
            }

            else
            {
              const dialogReference = this.dialog.open(
                ExistsDialogComponent,
                {
                  data: {
                    dialogTitle: 'Error',
                    dialogMessage: 'Can not establish connection to database. Please try again',
                    operation: 'ok',
                  },
                  width: '50vw',
                  height:'30vh'
                }
              );
            }
          });
      }
    });
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

}
