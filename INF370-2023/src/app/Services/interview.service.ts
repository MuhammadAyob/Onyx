import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InterviewService {

//CORS//

httpOptions = {
  headers: new HttpHeaders({
    ContentType: 'application/json'
  })
};

constructor(private http:HttpClient) { }

GetPending(){
  return this.http.get(environment.WebAPI + 'GetPending', this.httpOptions);
}

AddSlot(obj:any){
  return this.http.post(environment.WebAPI + 'AddSlot', obj, this.httpOptions);
}

UpdateSlot(id:number, obj:any){
  return this.http.put(environment.WebAPI + 'UpdateSlot/' + id, obj, this.httpOptions);
}

DeleteSlot(id:number){
  return this.http.put(environment.WebAPI + 'DeleteSlot/' + id, this.httpOptions);
}

GetSlots(){
  return this.http.get(environment.WebAPI + 'GetSlots', this.httpOptions);
}

}
