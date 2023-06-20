import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {
//CORS

httpOptions = {
  headers: new HttpHeaders({
    ContentType: 'application/json'
  })
};
  constructor(private http:HttpClient) { }

  GetApplications(){
    return this.http.get(environment.WebAPI + 'GetApplications', this.httpOptions);
  }

  RejectApplicant(id:number){
    return this.http.put(environment.WebAPI + 'RejectApplicant/' + id, this.httpOptions);
  }

  AddShortList(id:number){
    return this.http.put(environment.WebAPI + 'AddShortList/' + id, this.httpOptions);
  }
}
