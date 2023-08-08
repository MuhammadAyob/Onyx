import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ReportsService } from 'src/app/Services/reports.service';
import { Revenue } from 'src/app/Models/Revenue.model';

@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.scss']
})
export class SalesReportComponent implements OnInit {

  startDate: Date | null = null;
  endDate: Date | null = null;
  SalesData: any[] = [];
  GrandTotal:any;

  show:boolean=false;
  constructor( 
    private titleservice:Title,
    private service:ReportsService) 
    { this.titleservice.setTitle('Contact Query Report'); }

  ngOnInit(): void {
  }

  FetchReportData(){
    this.show=false;
    let revenue = new Revenue();
    revenue.startDate = this.startDate;
    revenue.endDate = this.endDate;
   
   
    this.service.GetSales(revenue).subscribe((data:any)=>{
      this.SalesData = data.SalesData;
      this.GrandTotal = data.GrandTotal;
      this.show=true;
    })
  }

}
