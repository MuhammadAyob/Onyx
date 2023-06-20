import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShortlistService {
//CORS

httpOptions = {
  headers: new HttpHeaders({
    ContentType: 'application/json'
  })
};

  constructor(private http:HttpClient) { }

  GetShortlist(){
    return this.http.get(environment.WebAPI + 'GetShortlist', this.httpOptions);
  }

  RemoveFromShortlist(id:number){
    return this.http.put(environment.WebAPI + 'RemoveFromShortlist/' + id, this.httpOptions);
  }

  RejectShortlistedCandidate(id:number){
    return this.http.put(environment.WebAPI + 'RejectShortlistedCandidate/' + id, this.httpOptions);
  }

  AcceptShortlistedCandidate(id:number){
    return this.http.put(environment.WebAPI + 'AcceptShortlistedCandidate/' + id, this.httpOptions);
  }

  OfferEmployment(id:number){
    return this.http.put(environment.WebAPI + 'OfferEmployment/' + id, this.httpOptions);
  }
}
