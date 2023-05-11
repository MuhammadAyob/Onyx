import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class VATService {

//CORS

httpOptions = {
 headers: new HttpHeaders({
  ContentType: 'application/json'
  })
};

constructor(private http:HttpClient) { }

AddVAT(obj:any){
    return this.http.post(environment.WebAPI + 'AddVAT/', obj ,this.httpOptions);
}

GetVATAmounts(){
    return this.http.get(environment.WebAPI + 'GetVATAmounts', this.httpOptions);
}

GetCurrentVAT(){
    return this.http.get(environment.WebAPI + ' GetCurrentVAT', this.httpOptions);
}

UpdateVAT(id: number, obj:any){
    return this.http.put(environment.WebAPI + 'UpdateVATAmount/' + id, obj, this.httpOptions);
}

DeleteVAT(id:number){
  return this.http.delete(environment.WebAPI + 'DeleteVAT/' + id, this.httpOptions);
}


}
