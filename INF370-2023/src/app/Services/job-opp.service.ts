import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map }from 'rxjs/operators';
import { JobOpportunities } from '../Models/JobOpportunities.model';

@Injectable({
  providedIn: 'root'
})
export class JobOppService {
test!: JobOpportunities;
//CORS

httpOptions = {
  headers: new HttpHeaders({
    ContentType: 'application/json'
  })
};

constructor(private http:HttpClient) { }

AddJob(obj:any){
  return this.http.post(environment.WebAPI + 'AddJob/', obj, this.httpOptions);
}

UpdateJob(id: number, obj: any){
  return this.http.put(environment.WebAPI + 'UpdateJob/' + id, obj, this.httpOptions);
}

DeleteJob(id:number){
  return this.http.put(environment.WebAPI + 'DeleteJob/' + id, this.httpOptions);
}

ExpiredJob(){
  return this.http.get(environment.WebAPI + 'ExpiredJobs', this.httpOptions);
}

GetJobOpps(){
  return this.http.get(environment.WebAPI + 'GetJobOpps', this.httpOptions);
}

GetActiveJobs(){
  return this.http.get(environment.WebAPI + 'GetActiveJobs', this.httpOptions);
}

GetWorkTypes(){
  return this.http.get(environment.WebAPI + 'GetWorkTypes', this.httpOptions);
}

GetStatuses(){
  return this.http.get(environment.WebAPI + 'GetStatuses', this.httpOptions);
}

}
