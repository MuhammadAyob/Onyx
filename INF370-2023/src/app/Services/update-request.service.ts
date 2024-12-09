import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UpdateRequestService {
 //CORS

 httpOptions = {
  headers: new HttpHeaders({
    ContentType: 'application/json'
  })
};

  constructor(private http:HttpClient) { }

  GetUpdateRequestDetails(){
    return this.http.get(environment.WebAPI + 'GetUpdateRequestDetails', this.httpOptions);
  }

  AcceptUpdateRequest(id:number){
    return this.http.put(environment.WebAPI + 'AcceptUpdateRequest/' + id, this.httpOptions);
  }

  RejectUpdateRequest(id:number){
    return this.http.put(environment.WebAPI + 'RejectUpdateRequest/' + id, this.httpOptions);
  }

  AddUpdateRequest(obj:any){
    return this.http.post(environment.WebAPI + 'AddUpdateRequest/', obj, this.httpOptions);
  }

  GetUserUpdateRequestDetails(id:number){
    return this.http.get(environment.WebAPI + 'GetUserUpdateRequestDetails/' + id, this.httpOptions);
  }
}
