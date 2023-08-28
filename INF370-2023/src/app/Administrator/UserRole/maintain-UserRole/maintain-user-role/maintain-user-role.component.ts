import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserRole } from 'src/app/Models/UserRole.model';
import { UserRoleService } from 'src/app/Services/user-role.service';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { AuditLog } from 'src/app/Models/audit.model';
import { AuditLogService } from 'src/app/Services/audit-log.service';
import { SecurityService } from 'src/app/Services/security.service';

@Component({
  selector: 'app-maintain-user-role',
  templateUrl: './maintain-user-role.component.html',
  styleUrls: ['./maintain-user-role.component.scss']
})
export class MaintainUserRoleComponent implements OnInit {
  nameFormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]);
  descFormControl = new FormControl('', [Validators.required]); 
  isLoading:boolean=false;
  userRole!: UserRole;
  userRoleList!: UserRole[];
  public dataSource = new MatTableDataSource<UserRole>();

  constructor(
    public router: Router,
    private location: Location,
    private dialog: MatDialog,
    private service: UserRoleService,
    private titleservice: Title,
    public toastr: ToastrService,
    private snack: MatSnackBar,
    private security:SecurityService,
    private aService:AuditLogService
  ) { this.titleservice.setTitle('User Role');}

  ngOnInit(): void {
    this.userRole = JSON.parse( sessionStorage['userRole'] );
  }

  onBack() {
    this.location.back();
  }

  refreshList() {
    this.service.GetUserRoles().subscribe((result) => {
      this.dataSource.data = result as UserRole[];
    });
  }

  onSubmit() {
    const isInvalid = this.validateFormControls();
    if (isInvalid == true) {
      this.dialog.open(InputDialogComponent, {
        data: {
          dialogTitle: "Input Error",
          dialogMessage: "Correct Errors on highlighted fields"
        },
        width: '25vw',
        height: '27vh',
      });
    } else {
    const dialogReference = this.dialog.open(ConfirmDialogComponent, {
      data: {
        dialogTitle: 'Confirm Edit User Role',
        dialogMessage: 'Are you sure you want to save changes to the user role?',
      },
      height: '30vh',
      width: '50vw',
    });

    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        this.isLoading=true;
        this.service
          .MaintainUserRole(this.userRole.UserRoleID, this.userRole)
          .subscribe((result:any) => {
            console.log(result);
            if (result.Status === 200) 
            {
              {
                this.snack.open('User role updated successfully', 'OK', {
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom',
                  duration: 3000,
                });
              }
              this.router.navigate(['admin/read-user-role'])
              this.isLoading=false;

                // Audit Log 

                let audit = new AuditLog();
                audit.AuditLogID = 0;
                audit.UserID = this.security.User.UserID;
                audit.AuditName = 'Update User Role';
                audit.Description = 'Employee, ' + this.security.User.Username + ', updated the user role ID: ' + this.userRole.UserRoleID
                audit.Date = '';
    
                this.aService.AddAudit(audit).subscribe((data) => {
                  //console.log(data);
                })
            } 
            else if(result.Status===404)
            {
              this.isLoading=false;
              const dialogReference = this.dialog.open(
                ExistsDialogComponent,
                {
                  data: {
                    dialogTitle: 'User Role Exists',
                    dialogMessage: 'Enter a new user role name',
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
                    dialogMessage:
                      'Can not establish connection. Please try again',
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
}

validateFormControls(): boolean {
  if (
    this.descFormControl.hasError('required') == false &&
    this.nameFormControl.hasError('pattern') == false &&
    this.nameFormControl.hasError('required') == false
  )
  {return false}
  else
  {return true}
}

onArrowBack() {
  this.location.back();
}

}
