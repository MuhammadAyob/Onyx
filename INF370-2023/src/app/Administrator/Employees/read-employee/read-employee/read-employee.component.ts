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

  onDelete(id:number) {
    const title = 'Confirm Delete Employee';
    const popupMessage = 'Employee was deleted successfully';
    const message = 'Are you sure you want to delete the Employee?';

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
        },
      }
    );
    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        this.service.DeleteEmployee(id).subscribe((res:any) => 
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
          }
          else if(res.Status===404)
          {
            const dialogReference = this.dialog.open(ExistsDialogComponent, {
              data: {
                dialogTitle: 'Error',
                dialogMessage: 'This is the last activated administrator, please ensure there are a minimum of 2 admins.',
                operation: 'ok',
              },
              width: '25vw',
            });
          }
          else if(res.Status===400)
          {
            const dialogReference = this.dialog.open(ExistsDialogComponent, {
              data: {
                dialogTitle: 'Error',
                dialogMessage: 'Invalid data',
                operation: 'ok',
              },
              width: '25vw',
            });
          }
          else
          {
            const dialogReference = this.dialog.open(ExistsDialogComponent, {
              data: {
                dialogTitle: 'Error',
                dialogMessage: 'Internal server error, please try again',
                operation: 'ok',
              },
              width: '25vw',
            });
          }
        });
      }
    });
  }

}
