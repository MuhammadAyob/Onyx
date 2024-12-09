import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class InstructionalVideoService {
//CORS

httpOptions = {
  headers: new HttpHeaders({
    ContentType: 'application/json'
  })
};
  constructor(private http:HttpClient) { }

  GetInstructionalVideosDetails()
  {
    return this.http.get(environment.WebAPI + 'GetInstructionalVideosDetails', this.httpOptions);
  }

  GetInstructionalVideos()
  {
    return this.http.get(environment.WebAPI + 'GetInstructionalVideos', this.httpOptions);
  }

  GetVideoName(id:number)
  {
    return this.http.get(environment.WebAPI + 'GetVideoName/' + id, this.httpOptions);
  }

  AddInstructionalVideo(obj:any)
  {
    return this.http.post(environment.WebAPI + 'AddInstructionalVideo/', obj, this.httpOptions);
  }

  UpdateInstructionalVideo(id:number, obj:any)
  {
    return this.http.put(environment.WebAPI + 'UpdateInstructionalVideo/' + id, obj, this.httpOptions);
  }

  DeleteInstructionalVideo(id:number)
  {
    return this.http.delete(environment.WebAPI + 'DeleteInstructionalVideo/' + id, this.httpOptions);
  }
}
