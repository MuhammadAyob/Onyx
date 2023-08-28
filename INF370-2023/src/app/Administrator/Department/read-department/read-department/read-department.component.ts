import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import {AfterViewInit,ViewChild, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Department } from 'src/app/Models/department.model';
import { DepartmentService } from 'src/app/Services/department.service';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import {map} from 'rxjs/operators';
import { AuditLogService } from 'src/app/Services/audit-log.service';
import { AuditLog } from 'src/app/Models/audit.model';
import { SecurityService } from 'src/app/Services/security.service';

@Component({
  selector: 'app-read-department',
  templateUrl: './read-department.component.html',
  styleUrls: ['./read-department.component.scss']
})

export class ReadDepartmentComponent implements OnInit {
displayedColumns: string[] = [
'DepartmentName',
'DepartmentDescription',
'view',
'edit',
'delete'
];

public dataSource = new MatTableDataSource<Department>();
noData = this.dataSource.connect().pipe(map(data=>data.length===0));
isLoading:boolean=true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;

  departmentlist!:Department[];

  department!:Department;
  
  constructor(
    private dialog:MatDialog,
    public router:Router,
    private location:Location,
    private service:DepartmentService,
    public toaster:ToastrService,
    private _snackBar:MatSnackBar,
    private titleservice:Title,
    private aService:AuditLogService,
    private security:SecurityService
  ) { this.titleservice.setTitle('Departments');}

  ngOnInit(): void {
    this.refreshList();
  }

  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.refreshList();
  }

  public doFilter = (event: Event) => {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
     if (this.dataSource.filteredData.length === 0) {

      const dialogReference = this.dialog.open(SearchDialogComponent, {

      });
      dialogReference.afterClosed().subscribe((result) => {
        if (result == true) {
         this.refreshList();
        }
      });
    }
  }

  refreshObject(){
    this.department = {
      DepartmentID: 0,
      DepartmentName: '',
      DepartmentDescription:''
    };
  }

  refreshList() {
    this.service.GetDepartments().subscribe((result) => {
      this.dataSource.data = result as Department[];
      this.isLoading=false;
    });
  }

  onEdit(obj:any) {
    sessionStorage['department'] = JSON.stringify(obj);
    this.router.navigate(['admin/maintain-department']);
  }

  addNew(): void {
    this.router.navigate(['admin/add-department']);
  }

  onView(obj:any) {
    sessionStorage['department'] = JSON.stringify(obj);
    this.router.navigate(['admin/view-department']);
  }

  onArrowBack(): void {
    this.location.back();
  }

  onDelete(obj:any) {
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
            this.service.DeleteDepartment(obj.DepartmentID).subscribe((res:any) => 
            {
              if(res.Status===200)
              {
                this._snackBar.open(
                  'Department deleted successfully!',
                        'OK',
                        {
                          horizontalPosition: 'center',
                          verticalPosition: 'bottom',
                          duration: 3000,
                        });
                this.refreshList();

              let audit = new AuditLog();
              audit.AuditLogID = 0;
              audit.UserID = this.security.User.UserID;
              audit.AuditName = 'Delete Department';
              audit.Description = 'Employee, ' + this.security.User.Username + ', deleted the Department: ' + obj.DepartmentName
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
