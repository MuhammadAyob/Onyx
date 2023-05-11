import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SkillService {
 
//CORS

 httpOptions = {
  headers: new HttpHeaders({
    ContentType: 'application/json'
  })
};

  constructor(private http:HttpClient) { }

  GetSkills(){
    return this.http.get(environment.WebAPI + 'GetSkills', this.httpOptions);
  }

  GetSkillTypes(){
    return this.http.get(environment.WebAPI + 'GetSkillTypes', this.httpOptions);
  }

  GetSkillList(){
    return this.http.get(environment.WebAPI + 'GetSkillList', this.httpOptions);
  }

  GetSkillID(id:number){
    return this.http.get(environment.WebAPI + 'GetSkillID/'+ id, this.httpOptions);
  }

  AddSkill(obj:any){
    return this.http.post(environment.WebAPI + 'AddSkill/', obj, this.httpOptions);
  }

  UpdateSkill(id:number,obj:any){
    return this.http.put(environment.WebAPI + 'UpdateSkill/' + id, obj, this.httpOptions);
  }

  DeleteSkill(id:number){
  return this.http.delete(environment.WebAPI + 'DeleteSkill/' + id, this.httpOptions);
}

}
