import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FAQService {
 
  //CORS//

 httpOptions = {
  headers: new HttpHeaders({
    ContentType: 'application/json'
  })
};
  constructor(private http:HttpClient) { }

  AddFAQ(obj:any)
  {
    return this.http.post(environment.WebAPI + 'AddFAQ/', obj, this.httpOptions);
  }

  UpdateFAQ(id:number, obj:any){
    return this.http.put(environment.WebAPI + 'UpdateFAQ/' + id, obj, this.httpOptions);
  }

  DeleteFAQ(id:number){
    return this.http.delete(environment.WebAPI + 'DeleteFAQ/' + id, this.httpOptions);
  }

  GetFAQs(){
    return this.http.get(environment.WebAPI + 'GetFAQs', this.httpOptions);
  }

}
