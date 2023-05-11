import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LessonService {

//CORS

httpOptions = {
  headers: new HttpHeaders({
    ContentType: 'application/json'
  })
};

constructor(private http:HttpClient) { }

GetSectionLessons(id:number){
  return this.http.get(environment.WebAPI + 'GetSectionLessons/' + id, this.httpOptions);
}

MaintainLesson(id:number){
  return this.http.get(environment.WebAPI + 'MaintainLesson/' + id, this.httpOptions);
}

AddLesson(obj:any){
  return this.http.post(environment.WebAPI + 'AddLesson/', obj, this.httpOptions);
}

UpdateLesson(id:number, obj:any){
  return this.http.put(environment.WebAPI + 'UpdateLesson/' + id, obj, this.httpOptions);
}

DeleteLesson(id:number){
  return this.http.delete(environment.WebAPI + 'DeleteLesson/' + id, this.httpOptions);
}

}
