import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ReportsService } from 'src/app/Services/reports.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-course-trend-report',
  templateUrl: './course-trend-report.component.html',
  styleUrls: ['./course-trend-report.component.scss']
})
export class CourseTrendReportComponent implements OnInit {
  displayedColumns: string[] = [
    'Course',
    'NumberSold',
    'TotalRevenue',
  ];
  isLoading!:boolean;
  show:boolean=false;
  date = new Date()
  startDate: Date | any;
  endDate: Date | any;
  fetched:boolean=false;

  public dataSource = new MatTableDataSource<any>();
  noData = this.dataSource.connect().pipe(map(data=>data.length===0));
 reportData:any[]=[];
    
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;
  SalesData: any[] = [];
  GrandTotal:any;
  //show:boolean=false;
  
  constructor(
  public router:Router,
  private location:Location,
  private titleservice:Title,
  private service:ReportsService
  ) 
  { this.titleservice.setTitle('Course Sales Trend Report');}

  

  ngOnInit(): void {
    this.refreshList();
  }

  back(){
    this.router.navigate(['admin/reports'])
  }

refreshList(){
  this.isLoading=true;
  this.show=false;
  this.fetched=false;
this.service.GetTrendsReport().subscribe((result) => {
  this.dataSource.data = result as any;
    this.reportData = result as any;
    this.isLoading=false;
    this.calculateTotalCoursesSoldAllTime();
    this.calculateTotalRevenueAllTime();
    this.show=true;
    this.fetched=true;

  });
}

calculateTotalCoursesSoldAllTime(): number {
  let totalCoursesSold = 0;
  for (const yearData of this.reportData) {
    for (const item of yearData.Courses) {
      totalCoursesSold += item.NumberofCoursesSold;
    }
  }
  return totalCoursesSold;
}

calculateTotalRevenueAllTime(): number {
  let totalRevenue = 0.00;
  for (const yearData of this.reportData) {
    for (const item of yearData.Courses) {
      totalRevenue += yearData.CategoryTotal;
    }
    //totalRevenue += yearData.TotalRevenue;
  }
  return totalRevenue;
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

    PDF.save(`Onyx-Sales-Trend-Report-${reportDate}.pdf`);
   
  });
  //this.isDownloading=false;
}

}
