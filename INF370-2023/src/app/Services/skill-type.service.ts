import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { SkillType } from '../Models/skill-type.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SkillTypeService {

  //CORS

httpOptions = {
  headers: new HttpHeaders({
    ContentType: 'application/json'
  })
};
  constructor(private http:HttpClient) { }

 AddSkillType(obj:any)
 {
  return this.http.post(environment.WebAPI + 'AddSkillType/', obj, this.httpOptions);
 }

 UpdateSkillType(id:number,obj:any)
 {
  return this.http.put(environment.WebAPI + 'UpdateSkillType/' + id, obj, this.httpOptions);
 }

 DeleteSkillType(id:number)
 {
  return this.http.delete(environment.WebAPI + 'DeleteSkillType/'+ id, this.httpOptions);
 }

 GetSkillTypes()
 {
  return this.http.get(environment.WebAPI + 'GetSkillTypes', this.httpOptions);
 }

}
