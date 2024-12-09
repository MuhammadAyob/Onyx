import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserroleService {

  //CORS

httpOptions = {
  headers: new HttpHeaders({
    ContentType: 'application/json'
  })
};
  constructor(private http:HttpClient) { }

  GetUserRoles(){
    return this.http.get(environment.WebAPI + 'GetUserRoles', this.httpOptions);
  }

  GetEmployeeUserRoles(){
    return this.http.get(environment.WebAPI + 'GetEmployeeUserRoles', this.httpOptions);
  }

  MaintainUserRole(id:number, obj:any)
  {
    return this.http.put(environment.WebAPI + 'MaintainUserRole/' + id, obj, this.httpOptions);
  }

  GetUserRoleID(id:number)
  {
    return this.http.get(environment.WebAPI + 'GetUserRoleID/' + id, this.httpOptions);
  }
}
