import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  //CORS

httpOptions = {
  headers: new HttpHeaders({
    ContentType: 'application/json'
  })
};

  constructor(private http:HttpClient) { }

  GetEmployees()
  {
    return this.http.get(environment.WebAPI + 'GetEmployees', this.httpOptions);
  }

  GetEmployeeName(id:any)
  {
    return this.http.get(environment.WebAPI + 'GetEmployeeName/' + id, this.httpOptions);
  }

  GetEmployeeDetails(id:number)
  {
   return this.http.get(environment.WebAPI + 'GetEmployeeDetails/' + id, this.httpOptions); 
  }
  
  GetEmployeeSkills(id:number)
  {
    return this.http.get(environment.WebAPI + 'GetEmployeeSkills/' + id, this.httpOptions);
  }

  GetEmployeeQualifications(id:number)
  {
    return this.http.get(environment.WebAPI + 'GetEmployeeQualifications/' + id, this.httpOptions);
  }

  UpdateEmployee(id:number, obj:any)
  {
    return this.http.put(environment.WebAPI + 'UpdateEmployee/' + id, obj, this.httpOptions);
  }

  DeleteEmployee(id:number)
  {
    return this.http.put(environment.WebAPI + 'DeleteEmployee/' + id, this.httpOptions);
  }

  GetUserRole(id:number){
    
  }



}
