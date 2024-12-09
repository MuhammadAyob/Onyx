import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {
//CORS

httpOptions = {
  headers: new HttpHeaders({
    ContentType: 'application/json'
  })
};

constructor(private http:HttpClient) { }

AddAudit(obj:any){
  return this.http.post(environment.WebAPI + 'AddAudit', obj, this.httpOptions)
}

GetAudits(obj:any){
  return this.http.post(environment.WebAPI + 'GetAudits', obj, this.httpOptions);
}

}
