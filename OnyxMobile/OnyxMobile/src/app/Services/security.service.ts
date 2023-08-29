import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../Models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class SecurityService {
//CORS

httpOptions = {
  headers: new HttpHeaders({
    ContentType: 'application/json'
  })
};

User: User = new User();

constructor(private http:HttpClient, private router: Router) { }

Login(user:User){
  return this.http.post(environment.WebAPI + 'Login/', user, this.httpOptions)
  .toPromise()
  .then((res:any) => (this.User = res as User))
  .then((res:any) => sessionStorage.setItem('Token-User', JSON.stringify(res)));
}

get isLoggedIn(){
   this.User = JSON.parse(sessionStorage.getItem('Token-User')||'{}');
   const guid = this.User.GUID;
  return this.User;
}

validateUser(){
  if (sessionStorage.getItem('Token-User') != null){
    return this.http.get(environment.WebAPI + 'ValidateUser/' + sessionStorage.getItem('Token-User'), this.httpOptions)
    .toPromise()
    .then((res:any)=>(this.User = res as User));
  }
  return;
}

getUserName(){
  const user = JSON.parse(sessionStorage.getItem('Token-User')||'{}');
  return this.http.get(environment.WebAPI + 'getUserName/' + user.UserID, this.httpOptions);
}

Logout(){
  sessionStorage.clear();
  this.router.navigateByUrl('/test-login');
  this.User = new User();
}



resetEmail(formData: User){
  return this.http.post(environment.WebAPI + 'ForgotPassword/', formData, this.httpOptions);
}

newPassword(formData:User){
 return this.http.post(environment.WebAPI + 'NewPassword/', formData, this.httpOptions);
}

getStudentID(id:number){
  return this.http.get(environment.WebAPI + 'GetStudentID/' + id, this.httpOptions);
}

getStudentName(id:any){
  return this.http.get(environment.WebAPI + 'GetStudentName/' + id, this.httpOptions);
}

getEmployeeID(id:number){
  return this.http.get(environment.WebAPI + 'GetEmployeeID/' + id, this.httpOptions);
}

getEmployeeName(id:number){
  return this.http.get(environment.WebAPI + 'GetEmployeeName/' + id, this.httpOptions);
}

}
