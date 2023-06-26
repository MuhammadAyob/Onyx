import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
//CORS

httpOptions = {
  headers: new HttpHeaders({
    ContentType: 'application/json'
  })
};

constructor(private http:HttpClient) { }

AddCourse(obj:any){
  return this.http.post(environment.WebAPI + 'AddCourse/' , obj, this.httpOptions);
}

GetCourseAssistants(id:number){
  return this.http.get(environment.WebAPI + 'GetCourseAssistants/' + id, this.httpOptions);
}

GetEmployeeList(){
  return this.http.get(environment.WebAPI+ 'GetEmployeesForCourses', this.httpOptions);
}

MaintainCourse(id:number){
  return this.http.get(environment.WebAPI + 'MaintainCourse/' + id, this.httpOptions);
}

GetCourseDetails(){
  return this.http.get(environment.WebAPI + 'GetCourseDetails', this.httpOptions);
}

UpdateCourse(id:number,obj:any){
  return this.http.put(environment.WebAPI + 'UpdateCourse/' + id, obj, this.httpOptions);
}

DeleteCourse(id:number){
  return this.http.delete(environment.WebAPI + 'DeleteCourse/' + id, this.httpOptions);
}

GetCourseID(id:number){
  return this.http.get(environment.WebAPI + 'GetCourseID/' + id, this.httpOptions);
}

GetCategory(id:number){
  return this.http.get(environment.WebAPI + 'GetCategory/'+ id, this.httpOptions);
}

ViewStore(studentID:number){
  return this.http.get(environment.WebAPI + 'ViewStore/' + studentID, this.httpOptions);
}

ViewCourseStructure(id:number){
  return this.http.get(environment.WebAPI + 'ViewCourseStructure/' + id, this.httpOptions);
}



}
