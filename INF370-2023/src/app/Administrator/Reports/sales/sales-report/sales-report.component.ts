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
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as xlsx from 'xlsx';

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
  date = new Date()
    
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;
  SalesData: any[] = [];
  GrandTotal:any;
  show:boolean=false;
  fetched:boolean=false;
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
    this.fetched=false;
    
    var SD:any;
  var ED:any;

  SD = this.datePipe.transform(this.startDate, 'yyyy/MM/dd');
  ED = this.datePipe.transform(this.endDate, 'yyyy/MM/dd');

  let revenue = new Revenue();
  revenue.startDate = SD;
  revenue.endDate = ED;
   
    this.service.GetSales(revenue).subscribe((data:any)=>{
      this.dataSource.data = data.SalesData;
      this.GrandTotal = data.GrandTotal;
      this.isLoading=false;
      this.show=true;
      this.fetched=true;
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

  downloadMaintainanceReportPDF() {
    //this.isDownloading=true;
    var Data = document.getElementById('htmlData')!;

    html2canvas(Data).then(function (canvas) {
      canvas.getContext('2d');

      var PdfWidth = canvas.width;
      var pdfHeight = canvas.height;
      const top_left_margin = 15;
      var PDF_Width = PdfWidth + top_left_margin * 2;

      var PDF_Height = PDF_Width * 1.5 + top_left_margin * 2;
      var pages = Math.ceil(pdfHeight / PDF_Height) - 1;

      var contentDataURL = canvas.toDataURL('image/jpeg', 1.0);
      var PDF = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);

      var imageWidth = PdfWidth;
      var imageHeight = pdfHeight;


      PDF.addImage(
        contentDataURL,
        'JPG',
        top_left_margin,
        top_left_margin,
        imageWidth,
        imageHeight
      );
      for (var i = 1; i <= pages; i++) {
        PDF.addPage([PDF_Width, PDF_Height]);
        PDF.addImage(
          contentDataURL,
          'JPG',
          top_left_margin,
          -(PDF_Height * i) + top_left_margin * 4,
          imageWidth,
          imageHeight
        );
      }

      const reportDate = new Date()
        .toJSON()
        .slice(0, 10)
        .split('-')
        .reverse()
        .join('-');

      PDF.save(`Onyx-Sales-Report-${reportDate}.pdf`);
     
    });
    //this.isDownloading=false;
  }

  downloadExcel(): void {
    const data: any[] = this.dataSource.data;
  
    const ws = xlsx.utils.json_to_sheet(data);
  
    // Loop through the columns to set the column width and protect specific columns
    const colWidths = [
      { wpx: 150 }, // Date column
      { wpx: 150 }, // CartID column
      { wpx: 200 }, // Student column
      { wpx: 100 }, // Total column 
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
    a.download = 'onyx_sales_data.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  }
  
  
  

}
