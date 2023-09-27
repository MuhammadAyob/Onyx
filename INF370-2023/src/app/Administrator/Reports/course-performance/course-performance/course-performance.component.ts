import { ChartConfiguration, ChartData, ChartEvent, ChartType,ChartOptions} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Component, OnInit, ViewChild} from '@angular/core';
import { ReportsService } from 'src/app/Services/reports.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl, Validators } from '@angular/forms';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { Dialog } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-course-performance',
  templateUrl: './course-performance.component.html',
  styleUrls: ['./course-performance.component.scss']
})
export class CoursePerformanceComponent implements OnInit {
  skillFormControl = new FormControl('', [Validators.required]);
displayedColumns: string[] = [
    'Date',
    'Student',
    'Rating',
    'Comment',
];
  
  average!:number;
  public dataSource = new MatTableDataSource<any>();
  noData = this.dataSource.connect().pipe(map(data=>data.length===0));
  isLoading!:boolean;
  fetched:boolean=false;
    
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;
showGraph:boolean=false;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
   
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 0,
        max:10
      },
    },
    plugins: {
legend:{display:false},
      title:{
        display: true,
        text: 'Course Performance Report Bar Graph',
      }
   
    }, 
   
   
  };

  public chartHovered({ event, active }: { event: ChartEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public barChartType: ChartType = 'bar';
 

  public barChartData: ChartData<'bar'> = {
    labels: ['1 Star Ratings', '2 Star Ratings', '3 Star Ratings', '4 Star Ratings', '5 Star Ratings'],
    datasets: [ {
      data: []
    } ]
  };

  courses!: any[];
  selectedCourseId: number | null = null;
  courseRatings: any[] = [];
  ratingCounts: any[] = [];

  constructor(private service:ReportsService, private router:Router,private dialog:MatDialog, private titleservice:Title) 
  { this.titleservice.setTitle('Course Performance Report');}

  ngOnInit(): void {
    this.fetchCourses();
  }

  GetHelp(){
    localStorage.removeItem('pageNumber');
    localStorage.setItem('pageNumber', '180');
  }

  fetchCourses(){
    this.service.GetReportCourses().subscribe((data:any)=>{
      this.courses=data as any[];
    })
  }

  onCourseSelected(){
    this.isLoading=true;
    this.showGraph=false;
    this.fetched=false;
    let totals = [];
    let labels = [];
      this.barChartData.datasets[0].data = [];
      this.service.CoursePerformance(this.selectedCourseId!).subscribe((data:any)=>{
        this.dataSource.data = data.Ratings;
        this.ratingCounts = data.RatingCounts;
        
        this.ratingCounts.forEach((element:any)=>{
          this.barChartData.datasets[0].data.push(element.Count);
          
        })

        this.barChartType;
        this.barChartOptions;
        this.barChartData;
        this.average = this.calculateAverageRating(data.Ratings);
        this.chart?.update();
        this.isLoading=false;
        this.showGraph=true;
        this.fetched=true;
        
      })
    
   
    
  }

  calculateAverageRating(ratings: any[]): number {
    if (ratings.length === 0) {
        return 0; // Handle case when no ratings are available
    }

    const totalRating = ratings.reduce((sum, rating) => sum + rating.Rating, 0);
    const averageRating = totalRating / ratings.length;
    return averageRating;
}

  date = new Date()

  selectCourse($event:any) {
    this.selectedCourseId = $event;
    this.fetched=false;
  }

  // Helper method to get the course name based on the selectedCourseId
  getSelectedCourseName(): string | undefined {
    const selectedCourse = this.courses.find(course => course.CourseID === this.selectedCourseId);
    return selectedCourse ? selectedCourse.Name : undefined;
  }

  back(){
    this.router.navigate(['admin/reports'])
  }

  onSubmit() {
    const isInvalid = this.validateFormControls();
    if (isInvalid == true) {
      this.dialog.open(InputDialogComponent, {
        data: {
          dialogTitle: "Input Error",
          dialogMessage: "Select a course before proceeding"
        },
        width: '25vw',
        height: '27vh',
      });
    } 
  else 
  {
   this.onCourseSelected();
  }
  }

  validateFormControls(): boolean {
    if (
      this.skillFormControl.hasError('required') == false
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

      PDF.save(`Onyx-Course-Performance-Report-${reportDate}.pdf`);
     
    });
    //this.isDownloading=false;
  }


}
