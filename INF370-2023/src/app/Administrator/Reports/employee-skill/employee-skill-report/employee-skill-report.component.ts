import { Component, OnInit, ViewChild} from '@angular/core';
import { ReportsService } from 'src/app/Services/reports.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ChartConfiguration, ChartData, ChartEvent, ChartType,ChartOptions} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
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
  selector: 'app-employee-skill-report',
  templateUrl: './employee-skill-report.component.html',
  styleUrls: ['./employee-skill-report.component.scss']
})
export class EmployeeSkillReportComponent implements OnInit {

  skillFormControl = new FormControl('', [Validators.required]);
  displayedColumns: string[] = [
    'Name',
    'Email',
    'RSAIDNumber',
    'Phone',
    ];
  
  public dataSource = new MatTableDataSource<any>();
  noData = this.dataSource.connect().pipe(map(data=>data.length===0));
  isLoading!:boolean;
  fetched:boolean=false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;
  skills!: any[];
  selectedSkillId: number | null = null;
  employeeList: any[] = [];
  date = new Date()
  isDownloading:boolean=false;

  constructor(private service:ReportsService, private dialog:MatDialog, private router:Router, private titleservice:Title) 
  {this.titleservice.setTitle('Employee Skill Report'); }

  ngOnInit(): void {
    this.fetchSkills();
  }

  GetHelp(){
    localStorage.removeItem('pageNumber');
    localStorage.setItem('pageNumber', '167');
  }

  fetchSkills(){
    this.service.GetSkillsWithTypes().subscribe((data:any)=>{
      this.skills=data as any[];
    })
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
          dialogMessage: "Select a skill before proceeding"
        },
        width: '25vw',
        height: '27vh',
      });
    } 
  else 
  {
   this.onSkillSelected();
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

  onSkillSelected(){
    this.fetched=false;
   this.isLoading=true;
      this.service.GetEmployeesWithSkill(this.selectedSkillId!).subscribe((data:any)=>{
        this.dataSource.data = data as any[];
        this.isLoading=false;
        this.fetched=true;
        
      })
    
   
    
  }

  
  selectSkill($event:any) {
    this.selectedSkillId = $event;
    this.fetched=false;
  }

  // Helper method to get the course name based on the selectedCourseId
  getSelectedSkill(): string | undefined {
    const selectedSkill = this.skills.find(skill => skill.SkillID === this.selectedSkillId);
    return selectedSkill ? selectedSkill.Skill : undefined;
  }

  downloadMaintainanceReportPDF() {
    this.isDownloading=true;
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

      PDF.save(`Onyx-Skill-Report-${reportDate}.pdf`);
     
    });
    this.isDownloading=false;
  }

}
