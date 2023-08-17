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

  constructor(private service:ReportsService, private dialog:MatDialog, private router:Router, private titleservice:Title) 
  {this.titleservice.setTitle('Employee Skill Report'); }

  ngOnInit(): void {
    this.fetchSkills();
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
  }

  // Helper method to get the course name based on the selectedCourseId
  getSelectedSkill(): string | undefined {
    const selectedSkill = this.skills.find(skill => skill.SkillID === this.selectedSkillId);
    return selectedSkill ? selectedSkill.Skill : undefined;
  }

}
