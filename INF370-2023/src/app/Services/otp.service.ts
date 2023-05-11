import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class OTPService {
//CORS

httpOptions = {
  headers: new HttpHeaders({
    ContentType: 'application/json'
  })
};


constructor(private http:HttpClient) { }

GetOTPTimer(){
    return this.http.get(environment.WebAPI + 'GetOTPTimer', this.httpOptions);
}

MaintainOTPTimer(id: number, obj:any){
    return this.http.put(environment.WebAPI + 'MaintainOTPTimer/' + id, obj, this.httpOptions);
}

}
