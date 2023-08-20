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
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { Dialog } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-maintenance-report',
  templateUrl: './maintenance-report.component.html',
  styleUrls: ['./maintenance-report.component.scss'],
  providers: [DatePipe]
})
export class MaintenanceReportComponent implements OnInit {
  displayedColumns: string[] = [
    'Name',
    'Total',
  ];

  fetched:boolean=false;
  date = new Date()
  
  constructor(
    private service:ReportsService, 
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private titleService: Title,
    private dialog:MatDialog,
    private router:Router) { this.titleService.setTitle('Maintainance Report'); }

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
 
  
  back(){
    this.router.navigate(['admin/reports'])
  }

  onSubmit() {
    //console.log(this.startDate)
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
   this.FetchData();
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

 
  

  public chartHovered({ event, active }: { event: ChartEvent, active: {}[] }): void {
    console.log(event, active);
  }


  isLoading!:boolean;
  startFormControl = new FormControl('', [Validators.required]);
  endFormControl = new FormControl('', [Validators.required]);

  startDate: Date | any;
  endDate: Date | any;
  chartData:any;
  public dataSource = new MatTableDataSource<any>();
  noData = this.dataSource.connect().pipe(map(data=>data.length===0));
 
    
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;

  reportData: any[] = [];

  FetchData(){
    this.isLoading=true;
    this.showGraph=false;
    this.fetched=false;
    //const parameters = this.setupDateParameters();
    this.TypesPieChart.datasets[0].data = [];
    this.TypesPieChart.labels = [];

    var SD:any;
    var ED:any;

    SD = this.datePipe.transform(this.startDate, 'yyyy/MM/dd');
    ED = this.datePipe.transform(this.endDate, 'yyyy/MM/dd');

    let revenue = new Revenue();
    revenue.startDate = SD;
    revenue.endDate = ED;
   
    this.service.GetMaintenanceReportData(revenue).subscribe((data:any)=>{
      data.ChartData.forEach((element: any) => {
        
        this.TypesPieChart.datasets[0].data.push(element.Total);
        this.TypesPieChart.labels!.push(element.Name);
      });

      this.maintenanceData = data.TableData;
      this.dataSource.data = data.ChartData;


      this.TypesPieChart;
      this.pieChartOptions;
      this.pieChartType;
      this.chart?.update();
      this.isLoading=false;
      this.showGraph=true;
      this.fetched=true;
    })
  }



 


  ngOnInit(): void {
    
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
