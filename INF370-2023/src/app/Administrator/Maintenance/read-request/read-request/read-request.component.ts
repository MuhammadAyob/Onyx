import { ViewChild, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { map } from 'rxjs/operators';
import { Maintenance } from 'src/app/Models/maintenance.model';
import { MaintenanceService } from 'src/app/Services/maintenance.service';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';

@Component({
  selector: 'app-read-request',
  templateUrl: './read-request.component.html',
  styleUrls: ['./read-request.component.scss']
})
export class ReadRequestComponent implements OnInit {
  displayedColumns: string[] = 
[
  'maintainTypeName',
  'maintainPriorityName',
 // 'maintainDesc',
  'maintainDateLogged',
  'maintainStatusName',
  'view',
  'edit',
  'delete'
];

public dataSource = new MatTableDataSource<any>();

noData = this.dataSource.connect().pipe(map((data) => data.length === 0));
isLoading:boolean=true;
@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;

maintenancelist!: Maintenance[];

displayList!: string[];

maintenance!: Maintenance;

constructor(
  public router: Router,
  private location: Location,
  private titleservice: Title,
  private service: MaintenanceService,
  public toaster: ToastrService,
  private dialog: MatDialog,
  private snack:MatSnackBar
) {this.titleservice.setTitle('Maintenance'); }

ngOnInit(): void {
  this.refreshList();
}

refreshList() {
  this.service.GetMaintenanceList().subscribe((result) => {
    this.displayList= result as any[];
    this.dataSource.data = this.displayList;
    this.isLoading=false;
  });
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
        console.log(result);
        this.refreshList();
      }
    });
  }
};

refreshObject() {
  this.maintenance = {
    MaintenanceID: 0,
    MaintenanceTypeID: 0,
    MaintenancePriorityID: 0,
    MaintenanceStatusID: 0,
    UserID: 0,
    Description: '',
    Image: '',
    DateLogged: new Date,
    Location: '',
    DateResolved: null
  };
}

onEdit(obj:any) {
  sessionStorage['MaintenanceRequest'] = JSON.stringify(obj);
  this.router.navigate(['admin/maintain-maintenance-request']);
}

addNew() {
  this.router.navigate(['user/log-maintenance-request']);
}

onView(obj:any) {
  sessionStorage['MaintenanceRequest'] = JSON.stringify(obj);
  this.router.navigate(['admin/confirm-maintenance-request']);
}

onArrowBack() {
  this.location.back();
}

onDelete(id:number) {
  const title = 'Confirm Delete Category';
  const message = 'Are you sure you want to delete the qualification?';
  
  const dialogReference = this.dialog.open(ConfirmDialogComponent, {
    data: {
      dialogTitle: title,
      dialogMessage: message,
      operation: 'delete',
      qualificationData: this.maintenance,
    }, //^captured department info here for validation
    height: '27vh',
    width: '25vw',
  });

  dialogReference.afterClosed().subscribe((result) => {
    if (result == true) {
      this.service.DeleteMaintenaceRequest(id).subscribe(
        (result:any) => {
          console.log(result);
          if(result.Status===200)
          {
            this.snack.open(
              'Maintenance request discarded successfully!',
                    'OK',
                    {
                      horizontalPosition: 'center',
                      verticalPosition: 'bottom',
                      duration: 3000,
                    }
            );
            this.refreshList();
          }
          else
          {
            this.dialog.open(InputDialogComponent, {
              height: '27vh',
              width: '25vw',
              data: {
                dialogTitle: 'Error',
                dialogMessage:'Internal server error. Please try again'
              },
            });
          }
        }
      );
    }
  });
  
  
}

}
