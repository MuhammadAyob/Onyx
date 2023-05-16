import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseCategoryService {

  //CORS

httpOptions = {
  headers: new HttpHeaders({
    ContentType: 'application/json'
  })
};

  constructor(private http:HttpClient) { }

AddCategory(obj:any)
{
return this.http.post(environment.WebAPI + 'AddCategory/', obj, this.httpOptions);
}

UpdateCategory(id:number,obj:any)
{
return this.http.put(environment.WebAPI + 'UpdateCategory/' + id, obj, this.httpOptions);
}

GetCategories()
{
return this.http.get(environment.WebAPI + 'GetCategories', this.httpOptions);
}

DeleteCategory(id:number)
{
return this.http.delete(environment.WebAPI + 'DeleteCategory/' + id, this.httpOptions);
} 
  
}
