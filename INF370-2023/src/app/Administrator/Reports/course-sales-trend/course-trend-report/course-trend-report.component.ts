import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ReportsService } from 'src/app/Services/reports.service';

@Component({
  selector: 'app-course-trend-report',
  templateUrl: './course-trend-report.component.html',
  styleUrls: ['./course-trend-report.component.scss']
})
export class CourseTrendReportComponent implements OnInit {
isLoading:boolean=true;
  constructor(
  public router:Router,
  private location:Location,
  private titleservice:Title,
  private service:ReportsService
  ) 
  { this.titleservice.setTitle('Course Sales Trend Report');}

  reportData:any;

  ngOnInit(): void {
    this.refreshList();
  }

refreshList(){
this.service.GetTrendsReport().subscribe((result) => {
    this.reportData = result as any;
    this.isLoading=false;
  });
}
}
