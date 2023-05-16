import { Injectable } from '@angular/core';
import { Qualification } from '../Models/qualification.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QualificationService {

//CORS

  httpOptions = {
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  };
  
  constructor(private http:HttpClient) { }

  GetQualifications()
  {
    return this.http.get(environment.WebAPI + 'GetQualifications', this.httpOptions);
  }

  AddQualification(obj:any)
  {
    return this.http.post(environment.WebAPI + 'AddQualification/', obj, this.httpOptions);
  }

  DeleteQualification(id:number)
  {
    return this.http.delete(environment.WebAPI + 'DeleteQualification/' + id, this.httpOptions);
  }

  UpdateQualification(id:number,obj:any)
  {
    return this.http.put(environment.WebAPI + 'UpdateQualification/' + id, obj, this.httpOptions);
  }
}
