import { AfterViewInit, ViewChild, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { map } from 'rxjs/operators';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { DisabledUsersService } from 'src/app/Services/disabled-users.service';
import { User } from 'src/app/Models/user.model';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { AuditLog } from 'src/app/Models/audit.model';
import { AuditLogService } from 'src/app/Services/audit-log.service';
import { SecurityService } from 'src/app/Services/security.service';

@Component({
  selector: 'app-re-activate-users',
  templateUrl: './re-activate-users.component.html',
  styleUrls: ['./re-activate-users.component.scss']
})
export class ReActivateUsersComponent implements OnInit {
displayedColumns: string[] = ['Username', 'Userrole','view'];

public dataSource = new MatTableDataSource<any>();

noData = this.dataSource.connect().pipe(map((data) => data.length === 0));
@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;
isLoading:boolean=true;
users!: any;

constructor(
  public router: Router,
  private location: Location,
  private titleservice: Title,
  private service: DisabledUsersService,
  public toaster: ToastrService,
  private snack: MatSnackBar,
  private dialog: MatDialog,
  private aService:AuditLogService,
  private security:SecurityService
) { this.titleservice.setTitle('Reactivate Users');}

ngOnInit(): void {
    this.refreshList();
}

GetHelp(){
  localStorage.removeItem('pageNumber');
  localStorage.setItem('pageNumber', '5');
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

refreshList() {
  this.service.GetDisabledUsers().subscribe((result) => {
    //console.log(result)
    this.dataSource.data = result as any[];
    this.isLoading=false;
  });
}

onView(obj:any) {

  const title = 'Confirm Reactivate User';
  const popupMessage = 'User was successfully Reactivated';
  const message = 'Are you sure you want to Reactivate this user?';

  

  const dialogReference = this.dialog.open(ConfirmDialogComponent, {
    width: '50vw',
    height:'30vh',
    data: {
      dialogTitle: title,
      operation: 'confirm',
      dialogMessage: message,
      dialogPopupMessage: popupMessage,
    },
  });
  dialogReference.afterClosed().subscribe((result) => {
    if (result == true) {
      this.isLoading=true;
      this.service.ReactivateUser(obj.UserID).subscribe((res:any) => {
        if(res.Status===200)
        {
          this.snack.open(
            'User re-activated successfully!',
                  'OK',
                  {
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                    duration: 3000,
                  }
          );
          this.refreshList();
          this.isLoading=false;

              // Audit Log 

              let audit = new AuditLog();
              audit.AuditLogID = 0;
              audit.UserID = this.security.User.UserID;
              audit.AuditName = 'Reactivate User';
              audit.Description = 'Employee, ' + this.security.User.Username + ', reactivated the user: ' + obj.Username + ' - ' + obj.UserRole.RoleName
              audit.Date = '';
  
              this.aService.AddAudit(audit).subscribe((data) => {
                //console.log(data);
              })
        }
        else
        {
          this.isLoading=false;
          const dialogReference = this.dialog.open(
            ExistsDialogComponent,
            {
              data: {
                dialogTitle: 'Error',
                dialogMessage: 'Internal server error, please try again',
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
