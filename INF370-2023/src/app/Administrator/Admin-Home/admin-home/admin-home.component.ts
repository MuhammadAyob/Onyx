import { Component, OnInit, ViewChild } from '@angular/core';
import { timer } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { ReportsService } from 'src/app/Services/reports.service';
import { Router } from '@angular/router';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit {
  dateTime!: Date;

  ActiveCourses:any;
  ActiveEmployees:any;
  ActiveJobs:any;
  ActiveStudents:any;
  ContactQ:any;
  PendingApplicants:any;
  PendingM:any;
  UpdateRequests!: any[];
  maintenanceTypeCounts:any[] =[];
  revenuePerYear:any[] = [];
  isLoading:boolean=true;

  constructor( 
    private titleservice:Title,
    private service:ReportsService,
    private router:Router
    ) 
    {  this.titleservice.setTitle('Home');}

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio:true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      }
    }
  };
 
  public pieChartType: ChartType = 'pie';

  //Types Pie
  public TypesPieChart: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [ {
      data: []
    } ]
  };

  public chartHovered({ event, active }: { event: ChartEvent, active: {}[] }): void {
    console.log(event, active);
  }

  ngOnInit(): void {
    this.GetData();

    timer(0, 1000).subscribe(() => {
      this.dateTime = new Date();
    })
  }

  GetData(){
    this.service.GetDashboardData().subscribe((data:any)=>{
      //console.log(data);
      this.ActiveCourses = data[0].ActiveCourses;
      this.ActiveEmployees = data[0].ActiveEmployees;
      this.ActiveJobs = data[0].ActiveJobs;
      this.ActiveStudents = data[0].ActiveStudents;
      this.ContactQ = data[0].ContactQ;
      this.PendingApplicants = data[0].PendingApplicants;
      this.PendingM = data[0].PendingM;
      this.UpdateRequests = data[0].UpdateRequests as any[];
      this.maintenanceTypeCounts = data[0].maintenanceTypeCounts as any[];

      this.maintenanceTypeCounts.forEach((element: any) => {
        
        this.TypesPieChart.datasets[0].data.push(element.Count);
        this.TypesPieChart.labels!.push(element.MaintenanceType);
      });

      this.revenuePerYear = data[0].revenuePerYear as any[];

      this.revenuePerYear.forEach((element:any)=>{
        this.barChartData.datasets[0].data.push(element.Revenue);
        this.barChartData.labels!.push(element.Year);
        
      })

      this.barChartType;
      this.barChartOptions;
      this.barChartData;
      this.chart?.update();

      this.TypesPieChart;
      this.pieChartOptions;
      this.pieChartType;
      this.chart?.update();

      this.isLoading=false;
    })
  }

  onUR(){
    this.router.navigate(['admin/read-update-requests'])
  }

  onMait(){
    this.router.navigate(['admin/reports/maintenance-report'])
  }

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
   
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 0,
        suggestedMax:20000
      },
    },
    plugins: {
legend:{display:false},
      title:{
        display: true,
        text: 'Revenue in Rands by Year Bar Graph',
      }
   
    }, 
   
   
  };

  

  public barChartType: ChartType = 'bar';
 

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [ {
      data: []
    } ]
  };

}
