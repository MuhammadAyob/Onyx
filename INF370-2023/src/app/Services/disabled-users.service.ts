import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DisabledUsersService {
//CORS

httpOptions = {
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
};

constructor(private http:HttpClient) { }

ReactivateUser(id:any)
{
  return this.http.put(environment.WebAPI + 'ReactivateUser/' + id, this.httpOptions);
}

GetDisabledUsers()
{
  return this.http.get(environment.WebAPI + 'GetDisabledUsers', this.httpOptions);
}

}
