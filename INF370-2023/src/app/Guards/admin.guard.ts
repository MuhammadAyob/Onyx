import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SecurityService } from '../Services/security.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
constructor(private security:SecurityService, private router:Router) {}
  
canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      if(this.security.User.UserRoleID===1){
        return true;
      }
      else{
        this.router.navigate(['/user/error-access']);
        return false;
      }
        
    }
  
}
