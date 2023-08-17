import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ReportsService } from 'src/app/Services/reports.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs';
import { MatSort } from '@angular/material/sort';

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

  startDate: Date | any;
  endDate: Date | any;

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
this.service.GetTrendsReport().subscribe((result) => {
  this.dataSource.data = result as any;
    this.reportData = result as any;
    this.isLoading=false;
    this.calculateTotalCoursesSoldAllTime();
    this.calculateTotalRevenueAllTime();
    this.show=true;

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

}
