import { Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { IonRouterOutlet, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UpdateProfileService } from 'src/app/Services/update-profile.service';
import { EmployeeService } from 'src/app/Services/employee.service';
import { TitleService } from 'src/app/Services/title.service';
import { DepartmentService } from 'src/app/Services/department.service';
import { UserroleService } from 'src/app/Services/userrole.service';

@Component({
  selector: 'app-employee-home',
  templateUrl: './employee-home.component.html',
  styleUrls: ['./employee-home.component.scss'],
})
export class EmployeeHomeComponent implements OnInit {
  @ViewChild(IonRouterOutlet, {static:false}) routerOutlet: IonRouterOutlet | undefined;
  search!: string;
  search2!:string;
  id: any;
  titleName!:string;
  deptName!: string;
  EmployeeSkillList!: any[];
  EmployeeQualificationList!: any[];
  roleName!: string;
  dataImage:any;
  EmployeeID:any
  DepartmentID:any
  isLoading!:boolean
  employee:any;
  titleList:any;
  constructor( 
    private serviceUpdate: UpdateProfileService,
    private serviceE:EmployeeService,
    private serviceT:TitleService, 
    private serviceD: DepartmentService,
    private serviceR: UserroleService,
    private router:Router,  
    private titleservice: Title,
    ) 
  { this.titleservice.setTitle('Employee Home');}

ngOnInit(): void {
  this.onEmployeeProfile();
  this.getTitleList();
}



onEmployeeProfile() {
  this.isLoading=true;
  this.serviceE.GetEmployeeName( JSON.parse(sessionStorage.getItem('EmployeeID')!)).subscribe((result:any) => {
    this.employee = result as any;
    sessionStorage['employee'] = JSON.stringify(this.employee);
    
    this.serviceD.GetDepartmentID(this.employee.DepartmentID).subscribe((result) =>{
      let data = result as any;
      this.deptName = data.DepartmentName;
      //console.log(this.deptName)
     });

     this.serviceE.GetEmployeeSkills(this.employee.EmployeeID).subscribe((result) => {
      this.EmployeeSkillList = result as any[];
      //console.log(this.EmployeeSkillList)
    });

    this.serviceE.GetEmployeeQualifications(this.employee.EmployeeID).subscribe((result) => {
      this.EmployeeQualificationList = result as any[];
      //console.log(this.EmployeeQualificationList)
    });

  });
}
getTitleList(){
  this.serviceT.GetTitles().subscribe((result)=>{
    this.titleList=result as any[];
    sessionStorage['titleList'] = JSON.stringify(this.titleList);
    this.isLoading=false;
   });
 }






  // Other methods and logic for your page

}
