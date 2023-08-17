import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ReportsService } from 'src/app/Services/reports.service';
import { Revenue } from 'src/app/Models/Revenue.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { invalid } from 'moment';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-contact-report',
  templateUrl: './contact-report.component.html',
  styleUrls: ['./contact-report.component.scss'],
  providers: [DatePipe]
})
export class ContactReportComponent implements OnInit {
  displayedColumns: string[] = [
    'Date',
    'Name',
    'Email',
    'Query',
  ];

  isLoading!:boolean;
  startFormControl = new FormControl('', [Validators.required]);
  endFormControl = new FormControl('', [Validators.required]);

  startDate: Date | any;
  endDate: Date | any;

  public dataSource = new MatTableDataSource<any>();
  noData = this.dataSource.connect().pipe(map(data=>data.length===0));
 
    
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;

  reportData: any[] = [];
  
  constructor(
    private titleservice:Title,
    private service:ReportsService,
    private router:Router,
    private dialog:MatDialog,
    private datePipe: DatePipe
  ) { this.titleservice.setTitle('Contact Query Report');}

  ngOnInit(): void {
  }

  FetchReportData(){
    this.isLoading=true;
    let revenue = new Revenue();
    revenue.startDate = this.startDate;
    revenue.endDate = this.endDate;
   
   
    this.service.GetContacts(revenue).subscribe((data)=>{
      this.dataSource.data = data as any;
      this.isLoading=false;
    })
  }

  back(){
    this.router.navigate(['admin/reports'])
  }

  onSubmit() {
    //console.log(this.startDate)
    const isInvalid = this.validateFormControls();
    const isInvalidRange = this.validateDate();
    if (isInvalid == true) {
      this.dialog.open(InputDialogComponent, {
        data: {
          dialogTitle: "Input Error",
          dialogMessage: "Correct errors on highlighted fields"
        },
        width: '25vw',
        height: '27vh',
      });
    } 

    else if(isInvalidRange == true)
    {
      this.dialog.open(InputDialogComponent, {
        data: {
          dialogTitle: "Date Range Error",
          dialogMessage: "The start date cannot be greater than the end date!"
        },
        width: '27vw',
        height: '29vh',
      });
    }
  else 
  {
   this.FetchReportData();
  }
  }

  validateDate(): boolean {
    if (this.startDate && this.endDate) {
      const formattedStartDate = this.datePipe.transform(this.startDate, 'yyyy/MM/dd');
      const formattedEndDate = this.datePipe.transform(this.endDate, 'yyyy/MM/dd');

      if (formattedStartDate! > formattedEndDate!) {
        return true;
      }
    }
    
    return false;
  }

  validateFormControls(): boolean {
    if (
      this.startFormControl.hasError('required') == false &&
      this.endFormControl.hasError('required') == false
    )
    {return(false)}
    else
    {return(true)}
  }

}
