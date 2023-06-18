import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaxslotsService {
//CORS

httpOptions = {
  headers: new HttpHeaders({
    ContentType: 'application/json'
  })
};

  constructor(private http:HttpClient) { }

  GetMaxSlots(){
    return this.http.get(environment.WebAPI + 'GetMaxSlots', this.httpOptions);
  }

  MaintainSlots(id:number, obj:any){
    return this.http.put(environment.WebAPI + 'MaintainSlots/' + id, obj, this.httpOptions);
  }
}
