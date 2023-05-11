import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LessonResourceService {

//CORS

httpOptions = {
  headers: new HttpHeaders({
    ContentType: 'application/json'
  })
};

constructor(private http:HttpClient) { }

GetLessonsResources(id:number){
  return this.http.get(environment.WebAPI + 'GetLessonsResources/' + id, this.httpOptions);
}

MaintainLessonResource(id:number){
  return this.http.get(environment.WebAPI + 'MaintainLessonResource/' + id, this.httpOptions);
}

AddLessonResource(obj:any){
  return this.http.post(environment.WebAPI + 'AddLessonResource/', obj, this.httpOptions);
}

UpdateLessonResource(id:number, obj:any){
  return this.http.put(environment.WebAPI + 'UpdateLessonResource/' + id, obj, this.httpOptions);
}

DeleteLessonResource(id:number){
  return this.http.delete(environment.WebAPI + 'DeleteLessonResource/' + id, this.httpOptions);
}

}
