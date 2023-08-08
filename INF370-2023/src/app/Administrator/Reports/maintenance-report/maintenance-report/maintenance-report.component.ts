import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { jsPDF } from 'jspdf';
import { ChartOptions } from 'chart.js';
import { Revenue } from 'src/app/Models/Revenue.model';
import { DatePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import html2canvas from 'html2canvas';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ReportsService } from 'src/app/Services/reports.service';

@Component({
  selector: 'app-maintenance-report',
  templateUrl: './maintenance-report.component.html',
  styleUrls: ['./maintenance-report.component.scss'],
  providers: [DatePipe]
})
export class MaintenanceReportComponent implements OnInit {

  constructor(
    private service:ReportsService, 
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private titleService: Title) { this.titleService.setTitle('Maintainance Report'); }

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
 
  maintenanceData!: any[];
  showGraph:boolean=false;
  
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
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


  range = new FormGroup({
    startDate: new FormControl(),
    endDate: new FormControl(),
  });

  FetchData(){
    this.showGraph=false;
    const parameters = this.setupDateParameters();
    this.TypesPieChart.datasets[0].data = [];
    this.TypesPieChart.labels = [];
    this.service.GetMaintenanceReportData(parameters).subscribe((data:any)=>{
      data.ChartData.forEach((element: any) => {
        
        this.TypesPieChart.datasets[0].data.push(element.Total);
        this.TypesPieChart.labels!.push(element.Name);
      });

      this.maintenanceData = data.TableData;

      this.TypesPieChart;
      this.pieChartOptions;
      this.pieChartType;
      this.chart?.update();
      this.showGraph=true;
    })
  }

  initializeForm(): void {
    this.range = this.formBuilder.group({
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
    });
  }

  formartDate(date: any): string {
    return this.datePipe.transform(date, 'yyyy/MM/dd')!;
  }

  setupDateParameters() {
    
    const UI_StartDate = this.range.get('startDate')!.value;
    const UI_EndDate = this.range.get('endDate')!.value;

    const parameters: Revenue = {
      startDate: this.formartDate(UI_StartDate),
      endDate: this.formartDate(UI_EndDate),
    };
    return parameters;
  }


  ngOnInit(): void {
    this.initializeForm();
  }

  downloadMaintainanceReportPDF() {
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

      PDF.save(`Onyx-Maintenance-Report-${reportDate}.pdf`);
    });
  }

}
