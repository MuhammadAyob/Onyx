import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TermsService {

//CORS

httpOptions = {
  headers: new HttpHeaders({
    ContentType: 'application/json'
  })
};


constructor(private http:HttpClient) { }

AddTerms(obj:any){
    return this.http.post(environment.WebAPI + 'AddTerms/', obj, this.httpOptions);
}

GetTerms(){
    return this.http.get(environment.WebAPI + 'GetTerms', this.httpOptions);
}

UpdateTerms(id:number, obj:any){
    return this.http.put(environment.WebAPI + 'UpdateTerms/' + id, obj, this.httpOptions);
}
}
