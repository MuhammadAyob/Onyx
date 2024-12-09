import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaintenancePriorityService {
//CORS

httpOptions = {
  headers: new HttpHeaders({
    ContentType: 'application/json'
  })
};

  constructor(private http:HttpClient) { }

  GetPriorities()
  {
    return this.http.get(environment.WebAPI + 'GetMaintenancePriorities', this.httpOptions);
  }

  AddPriority(obj:any)
  {
    return this.http.post(environment.WebAPI + 'AddMaintenancePriority/' , obj, this.httpOptions);
  }

  UpdatePriority(id:number,obj:any)
  {
   return this.http.put(environment.WebAPI + 'UpdateMaintenancePriority/'+ id, obj, this.httpOptions);
  }

  DeletePriority(id:number)
  {
   return this.http.delete(environment.WebAPI + 'DeleteMaintenancePriority/' + id, this.httpOptions);
  }
}
