import { Component, OnInit } from '@angular/core';
import { FormControl , Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { Department } from 'src/app/Models/department.model';
import { DepartmentService } from 'src/app/Services/department.service';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { AuditLogService } from 'src/app/Services/audit-log.service';
import { AuditLog } from 'src/app/Models/audit.model';
import { SecurityService } from 'src/app/Services/security.service';


@Component({
  selector: 'app-view-department',
  templateUrl: './view-department.component.html',
  styleUrls: ['./view-department.component.scss']
})
export class ViewDepartmentComponent implements OnInit {
  test!: Department;
departmentlist!: Department[];
id:any;
  
constructor(
    public router:Router,
    private service:DepartmentService,
    private dialog:MatDialog,
    private titleservice:Title,
    private location:Location,
    private snack:MatSnackBar,
    private aService:AuditLogService,
    private security:SecurityService
  ) {
    this.titleservice.setTitle('Departments');
   }

  ngOnInit(): void {
    this.test = JSON.parse(sessionStorage['department']);
  }

  refreshList(){
    this.service.GetDepartments().subscribe(res=>{
      this.departmentlist = res as Department[];
    });
  }

  onEdit(){
    this.router.navigate(['admin/maintain-department']);
    this.refreshList();
  }

  onBack() {
    this.location.back();
  }

  onArrowBack() {
    this.location.back();
  }

  onDelete() {
    const title = 'Confirm Delete Department';
    const message = 'Are you sure you want to delete the Department?';

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
            this.service.DeleteDepartment(this.test.DepartmentID).subscribe((res:any) => 
            {
              if(res.Status===200)
              {
                this.snack.open(
                  'Department deleted successfully!',
                        'OK',
                        {
                          horizontalPosition: 'center',
                          verticalPosition: 'bottom',
                          duration: 3000,
                        });
                this.router.navigate(['admin/read-department']);     
                let audit = new AuditLog();
                audit.AuditLogID = 0;
                audit.UserID = this.security.User.UserID;
                audit.AuditName = 'Delete Department';
                audit.Description = 'Employee, ' + this.security.User.Username + ', deleted the Department: ' + this.test.DepartmentName
                audit.Date = '';
  
               this.aService.AddAudit(audit).subscribe((data) => {
               })   
              }

              else if(res.Status===501)
              {
                this.dialog.open(
                  InputDialogComponent,
                  {
                    height: '30vh',
                    width: '50vw',
                    data: {
                      dialogTitle: "Delete Department",
                      dialogMessage: "Department cannot be deleted as it is in use in other parts of the system."
                    },
                  }
                );
              }

              else
              {
                this.dialog.open(
                  InputDialogComponent,
                  {
                    height: '30vh',
                    width: '50vw',
                    data: {
                      dialogTitle: "Error",
                      dialogMessage: "Internal server error, please try again."
                    },
                  }
                );
              }
            
            });
          }
        });
      }

}
