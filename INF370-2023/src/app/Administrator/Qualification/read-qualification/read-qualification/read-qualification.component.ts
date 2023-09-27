import { Component, OnInit,ViewChild } from '@angular/core';
import { Qualification } from 'src/app/Models/qualification.model';
import { QualificationService } from 'src/app/Services/qualification.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { map } from 'rxjs/operators';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { MatSort } from '@angular/material/sort';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { AuditLogService } from 'src/app/Services/audit-log.service';
import { AuditLog } from 'src/app/Models/audit.model';
import { SecurityService } from 'src/app/Services/security.service';

@Component({
  selector: 'app-read-qualification',
  templateUrl: './read-qualification.component.html',
  styleUrls: ['./read-qualification.component.scss']
})
export class ReadQualificationComponent implements OnInit {
  displayedColumns: string[] = [
    'QualificationName',
    'Description',
    'view',
    'edit',
    'delete',
  ];
  public dataSource = new MatTableDataSource<Qualification>();

  noData = this.dataSource.connect().pipe(map((data) => data.length === 0));

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  isLoading:boolean=true;
  qualificationList!: Qualification[];

  qualification!: Qualification;
  constructor(
    private dialog: MatDialog,
    public router: Router,
    private location: Location,
    private service: QualificationService,
    public toaster: ToastrService,
    private _snackBar: MatSnackBar,
    private titleservice: Title,
    private aService:AuditLogService,
    private security:SecurityService
  ) { this.titleservice.setTitle('Qualification');}

  ngOnInit(): void {
    this.refreshList();
  }

  GetHelp(){
    localStorage.removeItem('pageNumber');
    localStorage.setItem('pageNumber', '52');
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.refreshList();
  }

  public doFilter = (event:Event) => {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
    if (this.dataSource.filteredData.length === 0) {
      const dialogReference = this.dialog.open(SearchDialogComponent, {});
      dialogReference.afterClosed().subscribe((result) => {
        if (result == true) {
          console.log(result);
          this.refreshList();
        }
      });
    }
  };

  refreshObject() {
    this.qualification = {
      QualificationID: 0,
      QualificationName: '',
      Description: '',
    };
  }

  refreshList() {
    this.service.GetQualifications().subscribe((result) => {
      this.dataSource.data = result as Qualification[];
      this.isLoading=false;
    });
  }

  onEdit(obj:any) {
    sessionStorage['qualification'] = JSON.stringify(obj);
    this.router.navigate(['admin/maintain-qualification']);
  }
  addNew(): void {
    this.router.navigate(['admin/add-qualification']);
  }

  onView(obj:any) {
    sessionStorage['qualification'] = JSON.stringify(obj);
    this.router.navigate(['admin/view-qualification']);
  }

  onArrowBack(): void {
    this.location.back();
  }
  
  onDelete(obj: Qualification) {
    const title = 'Confirm Delete qualification';
    const message = 'Are you sure you want to delete the qualification?';
    
    const dialogReference = this.dialog.open(ConfirmDialogComponent, {
      data: {
        dialogTitle: title,
        dialogMessage: message,
        operation: 'delete',
        qualificationData: this.qualification,
      }, //^captured department info here for validation
      height: '30vh',
      width: '50vw',
    });

    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        this.service.DeleteQualification(obj.QualificationID).subscribe(
          (result:any) => {
            if(result.Status===200)
            {
              this._snackBar.open(
                'Qualification deleted successfully!',
                      'OK',
                      {
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        duration: 3000,
                      }
              );
              this.refreshList();
              let audit = new AuditLog();
              audit.AuditLogID = 0;
              audit.UserID = this.security.User.UserID;
              audit.AuditName = 'Delete Qualification';
              audit.Description = 'Employee, ' + this.security.User.Username + ', deleted the Qualification: ' + obj.QualificationName
              audit.Date = '';

             this.aService.AddAudit(audit).subscribe((data) => {
             })
            }

            else if(result.Status===501)
            {
              this.dialog.open(InputDialogComponent, {
                height: '30vh',
                width: '50vw',
                data: {
                  dialogTitle: 'Error',
                  dialogMessage:'Cannot delete Qualification as it is being used in other parts of the system.'
                },
              });
            }

            else
            {
              this.dialog.open(InputDialogComponent, {
                height: '30vh',
                width: '50vw',
                data: {
                  dialogTitle: 'Delete Qualification',
                  dialogMessage:'Internal server error, please try again.'
                },
              });
            }
          }
        );
      }
    });
    
    
  }

}
