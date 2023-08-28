import { Employee } from 'src/app/Models/employee.model';
import { EmployeeDetails } from 'src/app/Models/employee-details.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { EmployeeService } from 'src/app/Services/employee.service';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { map } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuditLogService } from 'src/app/Services/audit-log.service';
import { AuditLog } from 'src/app/Models/audit.model';
import { SecurityService } from 'src/app/Services/security.service';

@Component({
  selector: 'app-read-employee',
  templateUrl: './read-employee.component.html',
  styleUrls: ['./read-employee.component.scss']
})
export class ReadEmployeeComponent implements OnInit {
  test!: EmployeeDetails;

  displayedColumns: string[] = [
    'Image',
    'Name',
    'Surname',
    'view',
    'edit',
    'delete',
  ];

  public dataSource = new MatTableDataSource<EmployeeDetails>();

  noData = this.dataSource.connect().pipe(map((data) => data.length === 0));

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  isLoading:boolean=true;
  employee!: EmployeeDetails;
  titlename!:string;
  constructor(
    private dialog: MatDialog,
    public router: Router,
    private location: Location,
    private service: EmployeeService,
    public toaster: ToastrService,
    private titleservice: Title,
    private snack:MatSnackBar,
    private aService:AuditLogService,
    private security:SecurityService
  ) {  this.titleservice.setTitle('Employees');}

  ngOnInit(): void {
    this.refreshList();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.refreshList();
  }

  public doFilter = (event: Event) => {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
    if (this.dataSource.filteredData.length === 0) {
      const dialogReference = this.dialog.open(SearchDialogComponent, {});
      dialogReference.afterClosed().subscribe((result) => {
        if (result == true) {
          this.refreshList();
        }
      });
    }
  };

  refreshObject() {
    this.employee = {
      Employee: {
        EmployeeID: 0,
        UserRoleID: 0,
        TitleID:0,
        UserID: 0,
        DepartmentID: 0,
        Biography:'',
        Name: '',
        Surname: '',
        Email: '',
        RSAIDNumber: '',
        Phone: '',
        Deleted: '',
        Image:'',
      },
      Skills: null,
      Qualifications: null,
    };
  }

  refreshList() {
    this.service.GetEmployees().subscribe((result) => {
      this.dataSource.data = result as EmployeeDetails[];
      this.isLoading=false
    });
    
  }
  
  onEdit(id:number) {
    this.service.GetEmployeeDetails(id).subscribe((result) => {
      this.test = result as EmployeeDetails;
      sessionStorage['employee'] = JSON.stringify(this.test);
      this.router.navigate(['admin/maintain-employee']);
    });
  }

  addNew(): void {
    this.router.navigate(['admin/add-employee']);
  }

  onView(id:number) {
    this.service.GetEmployeeDetails(id).subscribe((result) => {
       this.test = result as EmployeeDetails;
       sessionStorage['employee'] = JSON.stringify(this.test);
       this.router.navigate(['admin/view-selected-employee']);
    });
  }

  onArrowBack(): void {
    this.location.back();
  }
  success(){
    this.toaster.success(
      'Employee Successfully deleted!',
      'Employee Deleted'
    );
  }

  onDelete(obj:any) {
    const title = 'Confirm deactivate Employee';
    const popupMessage = 'Employee was deactivated successfully';
    const message = 'Are you sure you want to deactivate the Employee?';

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
        },
      }
    );
    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        this.isLoading=true;
        this.service.DeleteEmployee(obj.EmployeeID).subscribe((res:any) => 
        {console.log(res)
          if(res.Status===200)
          {
            this.snack.open(
              'Employee deactivated successfully!',
                    'OK',
                    {
                      horizontalPosition: 'center',
                      verticalPosition: 'bottom',
                      duration: 3000,
                    }
            );
            
            this.refreshList();
            this.isLoading=false;

            let audit = new AuditLog();
            audit.AuditLogID = 0;
            audit.UserID = this.security.User.UserID;
            audit.AuditName = 'Deactivate Employee';
            audit.Description = 'Employee, ' + this.security.User.Username + ', deactivated the employee: ' + obj.Name + ' ' + obj.Surname + ' - ' + obj.Email
            audit.Date = '';
  
            this.aService.AddAudit(audit).subscribe((data) => {
              //console.log(data);
              //this.refreshForm();
            })
          }
          else if(res.Status===404)
          {
            this.isLoading=false;
            const dialogReference = this.dialog.open(ExistsDialogComponent, {
              data: {
                dialogTitle: 'Error',
                dialogMessage: 'This is the last activated administrator, please ensure there are a minimum of 2 admins.',
                operation: 'ok',
              },
              height: '30vh',
              width: '50vw',
            });
          }
          else if(res.Status===400)
          {
            this.isLoading=false;
            const dialogReference = this.dialog.open(ExistsDialogComponent, {
              data: {
                dialogTitle: 'Error',
                dialogMessage: 'Invalid data',
                operation: 'ok',
              },
              height: '30vh',
              width: '50vw',
            });
          }
          else if(res.Status === 900)
          {
            this.isLoading=false;
            const dialogReference = this.dialog.open(ExistsDialogComponent, {
              data: {
                dialogTitle: 'Error',
                dialogMessage: 'Employee is attached to one more courses as a correspondent. PLease re-attach new Course Correspondents before proceeding',
                operation: 'ok',
              },
              height: '40vh',
              width: '55vw',
            });
          }
          else
          {
            this.isLoading=false;
            const dialogReference = this.dialog.open(ExistsDialogComponent, {
              data: {
                dialogTitle: 'Error',
                dialogMessage: 'Internal server error, please try again',
                operation: 'ok',
              },
              height: '30vh',
              width: '50vw',
            });
          }
        });
      }
    });
  }

}
