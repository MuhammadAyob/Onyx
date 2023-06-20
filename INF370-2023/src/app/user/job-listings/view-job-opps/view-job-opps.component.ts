import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
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
import { JobOpportunities } from 'src/app/Models/JobOpportunities.model';
import { JobOppService } from 'src/app/Services/job-opp.service';

@Component({
  selector: 'app-view-job-opps',
  templateUrl: './view-job-opps.component.html',
  styleUrls: ['./view-job-opps.component.scss']
})
export class ViewJobOppsComponent implements OnInit {
jobOpportunityList!: JobOpportunities[];

jobOpportunity!: JobOpportunities;

search!:string;
constructor( 
  public router: Router,
  private service: JobOppService,
  private dialog: MatDialog,
  private location: Location,
  private titleservice: Title) 
  {this.titleservice.setTitle('View Available Job Opportunities'); }

  ngOnInit(): void {
    this.expiredJobs();
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

  public refreshList(){
    this.service.GetActiveJobs().subscribe((result)=>{
      this.jobOpportunityList = result as JobOpportunities[];
      console.log(result);
    })
  }

  onBack(){
    this.router.navigate(['home']);
  }

  onApply(obj:any){
    this.service.test = obj;
    this.router.navigate(['applicant-apply']);
  }

}
