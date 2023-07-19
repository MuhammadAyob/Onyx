import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient,HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UpdateProfileService {
 //CORS

 httpOptions = {
  headers: new HttpHeaders({
    ContentType: 'application/json'
  })
};
  constructor(private http:HttpClient) { }

  UpdateStudentProfile(id:number, obj:any){
    return this.http.put(environment.WebAPI + 'UpdateStudentProfile/' + id, obj, this.httpOptions);
  }

  UpdateEmployeeProfile(id:number, obj:any){
    return this.http.put(environment.WebAPI + 'UpdateEmployeeProfile/' + id, obj, this.httpOptions);
  }
}
