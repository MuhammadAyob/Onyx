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
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AuditLog } from 'src/app/Models/audit.model';
import { AuditLogService } from 'src/app/Services/audit-log.service';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import * as xlsx from 'xlsx';

@Component({
  selector: 'app-audit-log',
  templateUrl: './audit-log.component.html',
  styleUrls: ['./audit-log.component.scss'],
  providers: [DatePipe]
})
export class AuditLogComponent implements OnInit {
  displayedColumns: string[] = [
    'Date',
    'AuditName',
    'Description',
    'Username',
  ];

  isLoading!:boolean;
  startFormControl = new FormControl('', [Validators.required]);
  endFormControl = new FormControl('', [Validators.required]);
  fetched:boolean=false;
  startDate: Date | any;
  endDate: Date | any;

  public dataSource = new MatTableDataSource<any>();
  noData = this.dataSource.connect().pipe(map(data=>data.length===0));
 
    
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;

  reportData: any[] = [];
  
  date=new Date()

  constructor(
    private titleservice:Title,
    private service:AuditLogService,
    private router:Router,
    private dialog:MatDialog,
    private datePipe: DatePipe) 
    { this.titleservice.setTitle('Audit Log'); }

  ngOnInit(): void {
  }

  GetHelp(){
    localStorage.removeItem('pageNumber');
    localStorage.setItem('pageNumber', '33');
  }

  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    //this.refreshList();
  }

  FetchReportData(){
    this.fetched=false;
    this.isLoading=true;

    var SD:any;
    var ED:any;

    SD = this.datePipe.transform(this.startDate, 'yyyy/MM/dd');
    ED = this.datePipe.transform(this.endDate, 'yyyy/MM/dd');

    let revenue = new Revenue();
    revenue.startDate = SD;
    revenue.endDate = ED;
   
   
    this.service.GetAudits(revenue).subscribe((data)=>{
      //console.log(data)
      this.dataSource.data = data as any;
      this.isLoading=false;
      this.fetched=true;
    })
  }

  back(){
    this.router.navigate(['admin/reports'])
  }

  public doFilter = (event: Event) => {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
     if (this.dataSource.filteredData.length === 0) {

      const dialogReference = this.dialog.open(SearchDialogComponent, {

      });
      dialogReference.afterClosed().subscribe((result) => {
        if (result == true) {
         //this.refreshList();
        }
      });
    }
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

  downloadExcel(): void {
    const data: any[] = this.dataSource.data;
  
    const ws = xlsx.utils.json_to_sheet(data);
  
    // Loop through the columns to set the column width and protect specific columns
    const colWidths = [
      { wpx: 150 }, // Date column
      { wpx: 150 }, // Audit column
      { wpx: 200 }, // Desc column
      { wpx: 100 }, // User column 
    ];
    ws['!cols'] = colWidths;
  
    // Get the cell range that contains data
    const cellRange = ws['!ref'];
    const [startCell, endCell] = cellRange!.split(':');
    const startColIndex = xlsx.utils.decode_col(startCell);
    const endColIndex = xlsx.utils.decode_col(endCell);
  
    // Define the protected column indices
    const protectedColumnIndices = [0, 1, 2, 3]; // Date, CartID, Student, Total
  
    // Loop through the rows and columns to protect specific columns
    for (let r = 1; r <= data.length; r++) {
      for (let c = startColIndex; c <= endColIndex; c++) {
        if (!protectedColumnIndices.includes(c)) {
          const cellAddress = xlsx.utils.encode_cell({ r, c });
          ws[cellAddress] = { ...ws[cellAddress], ...{ locked: false } };
        }
      }
    }
  
    // Apply protection to the worksheet
    ws['!protect'] = {
      password: 'hello',
      selectLockedCells: true,
      selectUnlockedCells: true,
    };
  
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    const excelBuffer = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
  
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'onyx_audit_data.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  }

}
