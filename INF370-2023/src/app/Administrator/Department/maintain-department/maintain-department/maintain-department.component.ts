import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { Department } from 'src/app/Models/department.model';
import { DepartmentService } from 'src/app/Services/department.service';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuditLogService } from 'src/app/Services/audit-log.service';
import { AuditLog } from 'src/app/Models/audit.model';
import { SecurityService } from 'src/app/Services/security.service';


@Component({
  selector: 'app-maintain-department',
  templateUrl: './maintain-department.component.html',
  styleUrls: ['./maintain-department.component.scss']
})
export class MaintainDepartmentComponent implements OnInit {
nameFormControl = new FormControl('',[Validators.required]);
descFormControl = new FormControl('',[Validators.required]);

department!:Department;
departmentlist!:Department[];
isLoading:boolean=false;
public dataSource = new MatTableDataSource<Department>();
  constructor(
    public router:Router,
    private location:Location,
    private dialog:MatDialog,
    private service:DepartmentService,
    private titleservice:Title,
    public toastr: ToastrService,
    private snack:MatSnackBar,
    private aService:AuditLogService,
    private security:SecurityService
  ) { this.titleservice.setTitle('Departments')}

  ngOnInit(): void {
    this.department=JSON.parse(sessionStorage['department'])
  }

  onBack(): void {
    this.location.back();
  }

  refreshList() {
    this.service.GetDepartments().subscribe((result) => {
      this.dataSource.data = result as Department[];
    });
  }
  onSubmit() {
    const isInvalid = this.validateFormControls();
    if (isInvalid == true) {
      this.dialog.open(InputDialogComponent, {
        data: {
          dialogTitle: "Input Error",
          dialogMessage: "Correct errors on highlighted fields"
        },
        width: '25vw',
        height: '27vh',
      });
    } else {
      const title = 'Confirm Update Department';
      const message = 'Are you sure you want to save changes to the Department?';
      const popupMessage = 'Department changes successful!';
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
        departmentData: this.department,
      }, //^captured department info here for validation
      height: '30vh',
      width: '50vw',
    });

    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        this.isLoading=true;
        this.service
          .UpdateDepartment(this.department.DepartmentID, this.department)
          .subscribe((result:any) => {
            if (result.Status === 200) 
            {
              this.snack.open(
                'Department updated successfully!',
                      'OK',
                      {
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        duration: 3000,
                      }
              );
              this.isLoading=false;
              this.router.navigate(['admin/read-department']);
              
              let audit = new AuditLog();
              audit.AuditLogID = 0;
              audit.UserID = this.security.User.UserID;
              audit.AuditName = 'Update Department';
              audit.Description = 'Employee, ' + this.security.User.Username + ', updated the Department: ' + this.department.DepartmentName
              audit.Date = '';

          this.aService.AddAudit(audit).subscribe((data) => {
          })

            } 
            else if(result.Status===400)
            {
              this.isLoading=false;
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
              this.isLoading=false;
              const dialogReference = this.dialog.open(
                ExistsDialogComponent,
                {
                  data: {
                    dialogTitle: 'Error',
                    dialogMessage: 'Department exists, please enter a different Department',
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
      this.nameFormControl.hasError('required') == false &&
      this.descFormControl.hasError('required') == false
    )
    {return false}
    else
    {return true}
  }
  onArrowBack(): void {
    this.location.back();
  }

}
