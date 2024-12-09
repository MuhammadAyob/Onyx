import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SectionService {
//CORS

httpOptions = {
  headers: new HttpHeaders({
    ContentType: 'application/json'
  })
};

constructor(private http:HttpClient) { }

GetCourseSections(id:number){
  return this.http.get(environment.WebAPI + 'GetCourseSections/' + id, this.httpOptions);
}

MaintainSection(id:number){
  return this.http.get(environment.WebAPI + 'MaintainSection/' + id, this.httpOptions);
}

UpdateSection(id:number,obj:any){
  return this.http.put(environment.WebAPI + 'UpdateSection/' + id, obj, this.httpOptions);
}

AddSection(obj:any){
  return this.http.post(environment.WebAPI + 'AddSection/', obj, this.httpOptions);
}

DeleteSection(id:number){
  return this.http.delete(environment.WebAPI + 'DeleteSection/' + id, this.httpOptions);
}

}
