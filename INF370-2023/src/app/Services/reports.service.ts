import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
//CORS

httpOptions = {
  headers: new HttpHeaders({
    ContentType: 'application/json'
  })
};

constructor(private http:HttpClient) { }

GetTrendsReport(){
  return this.http.get(environment.WebAPI + 'TrendReport', this.httpOptions);
}

GetReportCourses(){
  return this.http.get(environment.WebAPI + 'GetReportCourses', this.httpOptions);
}

RevenueReport(obj:any){
  return this.http.post(environment.WebAPI + 'RevenueReport', obj, this.httpOptions);
}

GetMaintenanceReportData(obj:any){
  return this.http.post(environment.WebAPI + 'GetMaintenanceReportData', obj, this.httpOptions);
}

CoursePerformance(id:number){
  return this.http.get(environment.WebAPI + 'CoursePerformance/' + id, this.httpOptions);
}

GetSkillsWithTypes(){
  return this.http.get(environment.WebAPI + 'GetSkillsWithTypes', this.httpOptions);
}

GetEmployeesWithSkill(id:number){
  return this.http.get(environment.WebAPI + 'GetEmployeesWithSkill/' + id, this.httpOptions);
}

GetContacts(obj:any){
  return this.http.post(environment.WebAPI + 'GetContacts', obj, this.httpOptions);
}

GetSales(obj:any){
  return this.http.post(environment.WebAPI + 'GetSales', obj, this.httpOptions);
}

}
