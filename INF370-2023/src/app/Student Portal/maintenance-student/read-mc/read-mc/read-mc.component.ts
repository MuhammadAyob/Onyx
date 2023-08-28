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
  selector: 'app-read-mc',
  templateUrl: './read-mc.component.html',
  styleUrls: ['./read-mc.component.scss']
})
export class ReadMcComponent implements OnInit {

displayedColumns: string[] = 
[
  'maintainTypeName',
  'maintainPriorityName',
  'maintainDateLogged',
  'maintainStatusName',
  'view'
];

public dataSource = new MatTableDataSource<any>();

noData = this.dataSource.connect().pipe(map((data) => data.length === 0));
isLoading:boolean=true;
@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;

maintenancelist!: Maintenance[];

displayList!: string[];

maintenance!: Maintenance;
StudentID:any;

constructor(
  public router: Router,
  private location: Location,
  private titleservice: Title,
  private service: MaintenanceService,
  public toaster: ToastrService,
  private dialog: MatDialog,
  private snack:MatSnackBar) 
  
  {this.titleservice.setTitle('Maintenance'); }

ngOnInit(): void {
  this.StudentID = sessionStorage.getItem('StudentID');
  this.refreshList();
}

refreshList() {
  this.service.GetUserMaintenanceList(this.StudentID).subscribe((result) => {
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

onView(obj:any) {
  sessionStorage['MaintenanceRequest'] = JSON.stringify(obj);
  this.router.navigate(['student/view-query']);
}

}
