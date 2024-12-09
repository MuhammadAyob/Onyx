import { Injectable } from '@angular/core';
import { Qualification } from '../Models/qualification.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
//CORS

httpOptions = {
  headers: new HttpHeaders({
    ContentType: 'application/json'
  })
};

constructor(private http:HttpClient) { }

NewPurchase(id:any, cartObject:any) {
  return this.http.put(environment.WebAPI + 'NewPurchase/' + id, cartObject, this.httpOptions);
}

NewCart(details:any){
  return this.http.post(environment.WebAPI + 'NewCart', details, this.httpOptions);
}

GetInvoices(id:number){
  return this.http.get(environment.WebAPI + 'GetInvoices/' + id, this.httpOptions);
}

}
