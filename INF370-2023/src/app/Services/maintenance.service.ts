import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
//CORS

httpOptions = {
  headers: new HttpHeaders({
    ContentType: 'application/json'
  })
};

  constructor(private http:HttpClient) { }

  AddMaintenance(obj:any){
    return this.http.post(environment.WebAPI + 'AddMaintenanceRequest/', obj, this.httpOptions);
  }

  GetMaintenance(id:number){
    return this.http.get(environment.WebAPI + 'GetMaintenance/' + id, this.httpOptions);
  }

  MaintenanceReviewed(id:number){
    return this.http.put(environment.WebAPI + 'MaintenanceReviewed/' + id, this.httpOptions);
  }

  DeleteMaintenaceRequest(id:number)
  {
    return this.http.put(environment.WebAPI + 'DeleteMaintenaceRequest/' + id, this.httpOptions);
  }

  ConfirmMaintenanceRequest(id:number){
    return this.http.put(environment.WebAPI + 'ConfirmMaintenanceRequest/' + id, this.httpOptions);
  }

  UpdateMaintenanceRequest(id:number, obj:any){
    return this.http.put(environment.WebAPI + 'UpdateMaintenanceRequest/' + id, obj, this.httpOptions);
  }

  GetUserMaintenanceList(id:number){
    return this.http.get(environment.WebAPI + 'GetUserMaintenanceList/' + id, this.httpOptions);
  }

  GetMaintenanceList(){
    return this.http.get(environment.WebAPI + 'GetMaintenanceList', this.httpOptions);
  }
}
