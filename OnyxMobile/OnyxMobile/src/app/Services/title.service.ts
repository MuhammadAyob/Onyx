import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
 //CORS

 httpOptions = {
  headers: new HttpHeaders({
    ContentType: 'application/json'
  })
};

  constructor(private http:HttpClient) { }
GetTitles()
{
  return this.http.get(environment.WebAPI + 'GetTitles', this.httpOptions);
}
GetTitleID(id:number)
{
return this.http.get(environment.WebAPI + 'GetTitleID/' + id, this.httpOptions);
}

}
