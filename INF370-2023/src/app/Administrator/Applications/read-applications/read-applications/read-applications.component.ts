import { Component, OnInit, ViewChild } from '@angular/core';
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
import { Application } from 'src/app/Models/application.model';
import { ApplicationsService } from 'src/app/Services/applications.service';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-read-applications',
  templateUrl: './read-applications.component.html',
  styleUrls: ['./read-applications.component.scss']
})
export class ReadApplicationsComponent implements OnInit {
  displayedColumns: string[] = [
    'Image',
    'Name', 
    'Surname',  
    'JobOpp', 
    'view'
  ];
  
  public dataSource = new MatTableDataSource<Application>();
  noData = this.dataSource.connect().pipe(map((data) => data.length === 0));

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  applicationList!: Application[];

  application!: Application;

  constructor(
    public router: Router,
    private location: Location,
    private titleservice: Title,
    private service: ApplicationsService,
    public toaster: ToastrService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {this.titleservice.setTitle('Applications'); }

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

  refreshList(){
    this.service.GetApplications().subscribe((result)=>{
      this.dataSource.data=result as Application[];
    })
  }

  onView(obj:any) {
    sessionStorage['application'] = JSON.stringify(obj);
    this.router.navigate([
      'admin/view-application',
    ]);
  }

}
