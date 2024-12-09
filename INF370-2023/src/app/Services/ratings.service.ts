import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RatingsService {
//CORS

httpOptions = {
  headers: new HttpHeaders({
    ContentType: 'application/json'
  })
};

constructor(private http:HttpClient) { }

AddRating(obj:any){
  return this.http.post(environment.WebAPI + 'AddRating', obj,this.httpOptions);
}

UpdateRating(id:number, obj:any){
  return this.http.put(environment.WebAPI + 'UpdateRating/' + id, obj, this.httpOptions);
}

DeleteRating(id:number){
  return this.http.delete(environment.WebAPI + 'DeleteRating/' + id, this.httpOptions);
}

GetCoursesToRate(id:number){
  return this.http.get(environment.WebAPI + 'GetCoursesToRate/' + id, this.httpOptions);
}

}
