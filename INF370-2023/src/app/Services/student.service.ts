import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
//CORS

httpOptions = {
  headers: new HttpHeaders({
    ContentType: 'application/json'
  })
};

constructor(private http:HttpClient) { }

AddStudent(obj:any){
  return this.http.post(environment.WebAPI + 'NewStudent/', obj, this.httpOptions);
}

GetStudents(){
  return this.http.get(environment.WebAPI + 'GetStudents', this.httpOptions); 
}

DeleteStudent(id:number){
  return this.http.put(environment.WebAPI +'DeleteStudent/' + id, this.httpOptions);
}

}
