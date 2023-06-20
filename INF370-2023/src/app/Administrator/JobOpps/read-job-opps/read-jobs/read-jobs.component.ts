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
import { JobOpportunity } from 'src/app/Models/JobOpp.model';
import { JobOppService } from 'src/app/Services/job-opp.service';
import { MatSort } from '@angular/material/sort';
import { JobOpportunities } from 'src/app/Models/JobOpportunities.model';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

@Component({
  selector: 'app-read-jobs',
  templateUrl: './read-jobs.component.html',
  styleUrls: ['./read-jobs.component.scss']
})
export class ReadJobsComponent implements OnInit {
  displayedColumns: string[] = [
    'JobOppTitle',
    'Description',
    'JobOppDeadline',
    'JobOppStatus',
    'view',
  ];
  public dataSource = new MatTableDataSource<JobOpportunity>();

  noData = this.dataSource.connect().pipe(map((data) => data.length === 0));

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  jobOpportunityList!: JobOpportunities[];

  jobOpportunity!: JobOpportunities;

  constructor( public router: Router,
    private location: Location,
    private titleservice: Title,
    private dialog: MatDialog,
    private service: JobOppService,
    public toaster: ToastrService,
    private snack: MatSnackBar) {this.titleservice.setTitle('Job Opportunity'); }

  ngOnInit(): void {
    this.expiredJobs();
    this.refreshList();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.refreshList();
  }

  expiredJobs(){
    this.service.ExpiredJob().subscribe((result:any)=>{
      if(result.Status === 200)
      {
        console.log('success');
      }
      else
      {
        console.log('fail');
      }
      
    })
  }
  
  refreshList(){
    this.service.GetJobOpps().subscribe((result:any)=>{
      this.dataSource.data=result as JobOpportunities[];
      console.log(result);
    })
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

  addNew() {
    this.router.navigate(['admin/add-job']);
  }

  onView(obj:any) {
    sessionStorage['jobOpportunity'] = JSON.stringify(obj);
    this.router.navigate(['admin/view-job']);
  }

}
