import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map }from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

//CORS

httpOptions = {
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  };

  constructor(private http:HttpClient) { }

  AddDepartment(obj:any)
  {
   return this.http.post(environment.WebAPI + 'AddDepartment/', obj, this.httpOptions)
  }

  UpdateDepartment(id:number, obj:any)
  {
    return this.http.put(environment.WebAPI + 'UpdateDepartment/'+ id, obj, this.httpOptions)
  }

  DeleteDepartment(id:number)
  {
   return this.http.delete(environment.WebAPI + 'DeleteDepartment/' + id,this.httpOptions)
  }

  GetDepartments()
  {
   return this.http.get(environment.WebAPI + 'GetDepartments',this.httpOptions)
  }

  GetDepartmentID(id:number)
  {
   return this.http.get(environment.WebAPI+  'GetDepartmentID/' + id,this.httpOptions)
  }

  ValidateDepartment(id:number,obj:any)
  {
   return this.http.put(environment.WebAPI+'ValidateDepartment/'+id,obj,this.httpOptions)
  }



}
