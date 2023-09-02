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

  revenue = new Revenue();

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
    private service:ReportsService,
    private router:Router,
    private dialog:MatDialog,
    private datePipe: DatePipe
  ) { this.titleservice.setTitle('Contact Query Report');}

  ngOnInit(): void {
  }

  FetchReportData(){
    this.fetched=false;
    this.isLoading=true;

    var SD:any;
    var ED:any;

    SD = this.datePipe.transform(this.startDate, 'yyyy/MM/dd');
    ED = this.datePipe.transform(this.endDate, 'yyyy/MM/dd');

    //let revenue = new Revenue();
    this.revenue.startDate = SD;
    this.revenue.endDate = ED;
   
   
    this.service.GetContacts(this.revenue).subscribe((data)=>{
      this.dataSource.data = data as any;
      this.isLoading=false;
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

      PDF.save(`Onyx-Queries-Report-${reportDate}.pdf`);
     
    });
    //this.isDownloading=false;
  }

}
