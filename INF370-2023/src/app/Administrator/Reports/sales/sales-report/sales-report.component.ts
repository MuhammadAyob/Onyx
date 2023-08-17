import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ReportsService } from 'src/app/Services/reports.service';
import { Revenue } from 'src/app/Models/Revenue.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.scss'],
  providers: [DatePipe]
})
export class SalesReportComponent implements OnInit {
  displayedColumns: string[] = [
    'Date',
    'CartID',
    'Student',
    'Total',
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
  SalesData: any[] = [];
  GrandTotal:any;
  show:boolean=false;
  //show:boolean=false;
  constructor( 
    private titleservice:Title,
    private service:ReportsService,
    private datePipe: DatePipe, 
    private dialog:MatDialog,
    private router:Router) 
    { this.titleservice.setTitle('Purchase Transactions List Report'); }

  ngOnInit(): void {
  }

  FetchReportData(){
    this.isLoading=true;
    this.show=false;
    let revenue = new Revenue();
    revenue.startDate = this.startDate;
    revenue.endDate = this.endDate;
   
   
    this.service.GetSales(revenue).subscribe((data:any)=>{
      this.dataSource.data = data.SalesData;
      this.GrandTotal = data.GrandTotal;
      this.isLoading=false;
      this.show=true;
    })
  }

  back(){
    this.router.navigate(['admin/reports'])
  }

  onSubmit() {
   
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
