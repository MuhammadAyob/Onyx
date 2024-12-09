import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MaintenanceTypeService {
//CORS

httpOptions = {
  headers: new HttpHeaders({
    ContentType: 'application/json'
  })
};

  constructor(private http:HttpClient) { }

  AddType(obj:any)
  {
    return this.http.post(environment.WebAPI + 'AddMaintenanceType/', obj, this.httpOptions);
  }
  UpdateType(id:number,obj:any)
  {
   return this.http.put(environment.WebAPI + 'UpdateMaintenanceType/' + id, obj, this.httpOptions);
  }

  DeleteType(id:number)
  {
    return this.http.delete(environment.WebAPI + 'DeleteMaintenanceType/' + id, this.httpOptions);
  }

  GetTypes()
  {
return this.http.get(environment.WebAPI + 'GetMaintenanceTypes', this.httpOptions);
  }
}
