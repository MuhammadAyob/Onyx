import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map }from 'rxjs/operators';

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

}
