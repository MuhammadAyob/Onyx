import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ReportsService } from 'src/app/Services/reports.service';
import { Revenue } from 'src/app/Models/Revenue.model';

@Component({
  selector: 'app-revenue-report',
  templateUrl: './revenue-report.component.html',
  styleUrls: ['./revenue-report.component.scss']
})

export class RevenueReportComponent implements OnInit {
  startDate: Date | null = null;
  endDate: Date | null = null;
  reportData: any[] = [];

constructor(
  private titleservice:Title,
  private service:ReportsService) 

{ this.titleservice.setTitle('Revenue Report');}

ngOnInit(): void {
 
}



FetchReportData(){
  let revenue = new Revenue();
  revenue.startDate = this.startDate;
  revenue.endDate = this.endDate;
 
 
  this.service.RevenueReport(revenue).subscribe((data)=>{
    this.reportData = data as any;
  })
}

}
