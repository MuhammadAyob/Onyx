import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import {AfterViewInit,ViewChild, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MaintenancePriority } from 'src/app/Models/maintenance-priority.model';
import { MaintenancePriorityService } from 'src/app/Services/maintenance-priority.service';
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
import { AuditLog } from 'src/app/Models/audit.model';
import { AuditLogService } from 'src/app/Services/audit-log.service';
import { SecurityService } from 'src/app/Services/security.service';


@Component({
  selector: 'app-read-priority',
  templateUrl: './read-priority.component.html',
  styleUrls: ['./read-priority.component.scss']
})
export class ReadPriorityComponent implements OnInit {
displayedColumns: string[] = [
    'MaintenancePriority',
    'edit',
    'delete'
    ];
  

public dataSource = new MatTableDataSource<MaintenancePriority>();
noData = this.dataSource.connect().pipe(map(data=>data.length===0));
    
    
@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!:MatSort;
isLoading:boolean=true;
prioritylist!:MaintenancePriority[];
    
priority!:MaintenancePriority;    

constructor(
    private dialog:MatDialog,
    public router:Router,
    private location:Location,
    private service:MaintenancePriorityService,
    public toaster:ToastrService,
    private _snackBar:MatSnackBar,
    private titleservice:Title,
    private aService:AuditLogService,
    private security:SecurityService
  ) { this.titleservice.setTitle('Maintenance Priority');}

  ngOnInit(): void {
    this.refreshList();
  }

  GetHelp(){
    localStorage.removeItem('pageNumber');
    localStorage.setItem('pageNumber', '163');
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
    this.priority = {
      MaintenancePriorityID: 0,
      Priority: ''
    };
  }

  refreshList() {
    this.service.GetPriorities().subscribe((result) => {
      this.dataSource.data = result as MaintenancePriority[];
      this.isLoading=false;
    });
  }

  onEdit(obj:any) {
    sessionStorage['MaintenancePriority'] = JSON.stringify(obj);
    this.router.navigate(['admin/maintain-maintenance-priority']);
  }

  addNew(): void {
    this.router.navigate(['admin/add-maintenance-priority']);
  }


  onArrowBack(): void {
    this.location.back();
  }

  onDelete(obj:any) {
    const title = 'Confirm Delete Priority';
    const message = 'Are you sure you want to delete the priority?';

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
            this.service.DeletePriority(obj.MaintenancePriorityID).subscribe((res:any) => 
            {
              if(res.Status===200)
              {
                this._snackBar.open(
                  'Priority deleted successfully!',
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
              audit.AuditName = 'Delete Maintenance Priority';
              audit.Description = 'Employee, ' + this.security.User.Username + ', deleted the Maintenance Priority: ' + obj.Priority
              audit.Date = '';

             this.aService.AddAudit(audit).subscribe((data) => {
             })
              }

              else if(res.Status===500)
              {
                this.dialog.open(
                  InputDialogComponent,
                  {
                    height: '30vh',
                    width: '50vw',
                    data: {
                      dialogTitle: "Delete Priority",
                      dialogMessage: "Priority cannot be deleted as it is in use in other parts of the system."
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
