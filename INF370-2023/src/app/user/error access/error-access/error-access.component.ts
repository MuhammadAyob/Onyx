import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SecurityService } from 'src/app/Services/security.service';

@Component({
  selector: 'app-error-access',
  templateUrl: './error-access.component.html',
  styleUrls: ['./error-access.component.scss']
})
export class ErrorAccessComponent implements OnInit {

  constructor(public router:Router,
    private location:Location,
    private security:SecurityService) { }

  ngOnInit(): void {
   
   if (this.security.User===null) 
   {
    console.log("There is 'name' in session storage ")
    this.router.navigateByUrl('login');
  }
   
  }

  back() {
    if (this.security.User.UserRoleID === 1) {
      this.router.navigateByUrl('home/admin-home');
  
    }
    else if (this.security.User.UserRoleID === 2) {
     
      this.router.navigateByUrl('home/employee-home');
  
    }
    else if (this.security.User.UserRoleID === 3) {
    
      this.router.navigateByUrl('home/student-home');
  
    }
  }

}
