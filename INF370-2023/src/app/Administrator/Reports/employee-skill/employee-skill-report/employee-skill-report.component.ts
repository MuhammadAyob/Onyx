import { Component, OnInit, ViewChild} from '@angular/core';
import { ReportsService } from 'src/app/Services/reports.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ChartConfiguration, ChartData, ChartEvent, ChartType,ChartOptions} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-employee-skill-report',
  templateUrl: './employee-skill-report.component.html',
  styleUrls: ['./employee-skill-report.component.scss']
})
export class EmployeeSkillReportComponent implements OnInit {
  skills: any[] = [];
  selectedSkillId: number | null = null;
  employeeList: any[] = [];

  constructor(private service:ReportsService) { }

  ngOnInit(): void {
    this.fetchSkills();
  }

  fetchSkills(){
    this.service.GetSkillsWithTypes().subscribe((data:any)=>{
      this.skills=data as any[];
    })
  }

  onSkillSelected(){
   
      this.service.GetEmployeesWithSkill(this.selectedSkillId!).subscribe((data:any)=>{
        this.employeeList = data as any[]
        
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
