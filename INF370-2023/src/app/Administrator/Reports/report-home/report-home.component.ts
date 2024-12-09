import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-report-home',
  templateUrl: './report-home.component.html',
  styleUrls: ['./report-home.component.scss']
})
export class ReportHomeComponent implements OnInit {
displayedColumns: string[] = [
    'name',
    'description',
    'view'
];

dataSource = ELEMENT_DATA;


constructor(private router:Router, private title:Title) {this.title.setTitle('Reports') }

ngOnInit(): void {
}

GetHelp(){
  localStorage.removeItem('pageNumber');
  localStorage.setItem('pageNumber', '167');
}

onRoute(obj:any){
  if(obj.id == 1)
  {
   this.router.navigate(['admin/reports/employee-skill-report'])
  }
  else if(obj.id == 2)
  {
    this.router.navigate(['admin/reports/contact-report'])
  }
  else if(obj.id == 3)
  {
    this.router.navigate(['admin/reports/sales-report'])
  }
  else if(obj.id == 4)
  {
    this.router.navigate(['admin/reports/revenue-report'])
  }
  else if(obj.id == 5)
  {
    this.router.navigate(['admin/reports/course-sales-trend-report'])
  }
  else if(obj.id == 6)
  {
    this.router.navigate(['admin/reports/maintenance-report'])
  }
  else if(obj.id == 7)
  {
    this.router.navigate(['admin/reports/course-performance-report'])
  }
}

}

export interface Element {
  id:number;
  name: string;
  description: string;
}

const ELEMENT_DATA: Element[] = [
  {id:1,name: 'Employee Skill List Report', description: "This report generates and retrieves a list of employee's that possess a selected skill on the Onyx System."},
  {id:2,name: 'Contact Queries List Report', description: "This report generates and retrieves a list of all contact queries sent by user's over a period of time."},
  {id:3,name: 'Purchase Transactions List Report',description:'This report generates and retrieves a list of all purchases on the Onyx system over a period of time.'},
  {id:4,name: 'Revenue Report',description:'Analysis of revenue generated from courses purchased over a period of time.'},
  {id:5,name: 'Course Sales Trend Report',description:'Analysis of courses sold and revenue generated per category, separated by category. Subtotals included. '},
  {id:6,name: 'Maintenance Report', description:'Analysis of all maintenance issues and the amount of occurrences over a period of time.'},
  {id:7,name: 'Course Performance Report',description:'Analysis of a selected course based on ratings uploaded by students on the Onyx system.'}
];
