import { Component, OnInit, ViewChild} from '@angular/core';
import { ReportsService } from 'src/app/Services/reports.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ChartConfiguration, ChartData, ChartEvent, ChartType,ChartOptions} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
@Component({
  selector: 'app-course-performance',
  templateUrl: './course-performance.component.html',
  styleUrls: ['./course-performance.component.scss']
})
export class CoursePerformanceComponent implements OnInit {
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

  courses: any[] = [];
  selectedCourseId: number | null = null;
  courseRatings: any[] = [];
  ratingCounts: any[] = [];

  constructor(private service:ReportsService) { }

  ngOnInit(): void {
    this.fetchCourses();
  }

  fetchCourses(){
    this.service.GetReportCourses().subscribe((data:any)=>{
      this.courses=data as any[];
    })
  }

  onCourseSelected(){
    this.showGraph=false;
    let totals = [];
    let labels = [];
      this.barChartData.datasets[0].data = [];
      this.service.CoursePerformance(this.selectedCourseId!).subscribe((data:any)=>{
        this.courseRatings = data.Ratings;
        this.ratingCounts = data.RatingCounts;
        
        this.ratingCounts.forEach((element:any)=>{
          this.barChartData.datasets[0].data.push(element.Count);
          
        })

        this.barChartType;
        this.barChartOptions;
        this.barChartData;
        this.chart?.update();
        this.showGraph=true;
        
      })
    
   
    
  }

  selectCourse($event:any) {
    this.selectedCourseId = $event;
  }

  // Helper method to get the course name based on the selectedCourseId
  getSelectedCourseName(): string | undefined {
    const selectedCourse = this.courses.find(course => course.CourseID === this.selectedCourseId);
    return selectedCourse ? selectedCourse.Name : undefined;
  }


}
