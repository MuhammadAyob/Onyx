import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SecurityService } from '../Services/security.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {
  constructor(private security:SecurityService, private router:Router){}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      if(sessionStorage.length === 0)
      {
        this.router.navigate(['/login']);
        return false;
      }

      else
      {
        return true;
      }
   // if(this.security.isLoggedIn === null)
   //// {
    //  this.router.navigate(['/login']);
   //   return false;
      
   // }
   // else{
   //   return true;
   // }
      
    

  }
  
}
