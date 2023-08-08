import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ReportsService } from 'src/app/Services/reports.service';
import { Revenue } from 'src/app/Models/Revenue.model';

@Component({
  selector: 'app-contact-report',
  templateUrl: './contact-report.component.html',
  styleUrls: ['./contact-report.component.scss']
})
export class ContactReportComponent implements OnInit {
  startDate: Date | null = null;
  endDate: Date | null = null;
  reportData: any[] = [];
  constructor(
    private titleservice:Title,
    private service:ReportsService
  ) { this.titleservice.setTitle('Contact Query Report');}

  ngOnInit(): void {
  }

  FetchReportData(){
    let revenue = new Revenue();
    revenue.startDate = this.startDate;
    revenue.endDate = this.endDate;
   
   
    this.service.GetContacts(revenue).subscribe((data)=>{
      this.reportData = data as any;
    })
  }

}
